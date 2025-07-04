import { format } from "date-fns";
import { safeAsync, safeFetch, safeSync } from "../shared/safeStorage";
import type { CalendarEvent, FamilyMember } from "../shared/types";

// Googleカレンダーのみ対応
export type CalendarDataProvider = { type: "google"; accessToken: string };

/**
 * 指定した日付の家族全員のカレンダーイベントを取得
 */
export const getCalendarEvents = async (
	provider: CalendarDataProvider,
	date: Date,
	familyMembers: FamilyMember[],
): Promise<CalendarEvent[]> => {
	return await getGoogleCalendarEvents(
		provider.accessToken,
		date,
		familyMembers,
	);
};

/**
 * 利用可能なカレンダーの一覧を取得
 */
export const getAvailableCalendars = async (
	provider: CalendarDataProvider,
): Promise<{ id: string; name: string; color?: string }[]> => {
	return await getGoogleAvailableCalendars(provider.accessToken);
};

/**
 * Googleカレンダーからイベントを取得する関数
 */
const getGoogleCalendarEvents = async (
	accessToken: string,
	date: Date,
	familyMembers: FamilyMember[],
): Promise<CalendarEvent[]> => {
	const dateStr = format(date, "yyyy-MM-dd");
	const timeMin = `${dateStr}T00:00:00.000Z`;
	const timeMax = `${dateStr}T23:59:59.999Z`;

	const allEvents: CalendarEvent[] = [];

	for (const member of familyMembers) {
		if (!member.calendarId) continue;

		console.log(`📅 Fetching events for ${member.name} (${member.calendarId})`);

		const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
			member.calendarId,
		)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

		const fetchResult = await safeFetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!fetchResult.success) {
			console.error(
				`Failed to fetch events for ${member.name}:`,
				fetchResult.error,
			);
			continue;
		}

		const response = fetchResult.data;
		if (!response.ok) {
			console.error(
				`Failed to fetch events for ${member.name}:`,
				response.status,
			);
			continue;
		}

		const jsonResult = await safeAsync(
			() => response.json(),
			`Failed to parse JSON for ${member.name}`,
		);

		if (!jsonResult.success) {
			console.error(`JSON parse error for ${member.name}:`, jsonResult.error);
			continue;
		}

		const data = jsonResult.data;
		console.log(
			`📊 Found ${data.items?.length || 0} events for ${member.name}`,
		);

		if (data.items) {
			const memberEvents = data.items.map((event: Record<string, unknown>) => {
				const start = event.start as
					| { dateTime?: string; date?: string }
					| undefined;
				const end = event.end as
					| { dateTime?: string; date?: string }
					| undefined;
				const startTimeStr = start?.dateTime || start?.date || "";
				const endTimeStr = end?.dateTime || end?.date || "";

				return {
					id: event.id as string,
					title: (event.summary as string) || "(タイトルなし)",
					startTime: startTimeStr,
					endTime: endTimeStr,
					startHour: parseHour(startTimeStr),
					endHour: parseHour(endTimeStr),
					member: member.member,
					color: member.color,
					calendarId: member.calendarId,
				};
			});
			allEvents.push(...memberEvents);
		}
	}

	console.log(`📊 Total events fetched: ${allEvents.length}`);
	return allEvents;
};

/**
 * Google利用可能カレンダー一覧を取得する関数
 */
const getGoogleAvailableCalendars = async (
	accessToken: string,
): Promise<{ id: string; name: string; color?: string }[]> => {
	const fetchResult = await safeFetch(
		"https://www.googleapis.com/calendar/v3/users/me/calendarList",
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		},
	);

	if (!fetchResult.success) {
		console.error("Error fetching available calendars:", fetchResult.error);
		return [];
	}

	const response = fetchResult.data;
	if (!response.ok) {
		console.error(`Failed to fetch calendars: ${response.status}`);
		return [];
	}

	const jsonResult = await safeAsync(
		() => response.json(),
		"Failed to parse calendar list JSON",
	);

	if (!jsonResult.success) {
		console.error("Calendar list JSON parse error:", jsonResult.error);
		return [];
	}

	const data = jsonResult.data;
	return (
		data.items?.map((calendar: Record<string, unknown>) => ({
			id: calendar.id as string,
			name: calendar.summary as string,
			color: calendar.backgroundColor as string,
		})) || []
	);
};

/**
 * 日時文字列から時間を解析するヘルパー関数
 */
const parseHour = (dateTimeStr: string): number => {
	if (!dateTimeStr) return 0;

	const parseResult = safeSync(() => {
		// ISO 8601形式の日時文字列から時間を抽出
		const date = new Date(dateTimeStr);
		if (Number.isNaN(date.getTime())) {
			throw new Error("Invalid date string");
		}
		return date.getHours();
	}, "Date parsing failed");

	if (!parseResult.success) {
		// 日付のみの場合（終日イベント）は0時として扱う
		return 0;
	}

	return parseResult.data;
};
