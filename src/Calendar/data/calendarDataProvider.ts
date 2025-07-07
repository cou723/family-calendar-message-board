import { format } from "date-fns";
import { AppStorage } from "../shared/appStorage";
import { safeAsync, safeFetch, safeSync } from "../shared/safeStorage";
import type { CalendarEvent, FamilyMember } from "../shared/types";

// Googleカレンダーのみ対応
export type CalendarDataProvider = { type: "google"; accessToken: string };

// カレンダーAPIエラー型
export type CalendarApiError = {
	type:
		| "AUTHENTICATION_ERROR"
		| "PERMISSION_ERROR"
		| "NETWORK_ERROR"
		| "UNKNOWN_ERROR";
	message: string;
	status?: number;
};

// 401エラー時のトークン無効化処理
const handleAuthenticationError = (_calendarId?: string): void => {
	console.warn("🔐 Authentication error detected. Clearing access token.");
	// アクセストークンを削除
	AppStorage.clearGoogleAuthData();
	// 認証状態をリセット
	window.dispatchEvent(
		new CustomEvent("auth-state-changed", { detail: { authenticated: false } }),
	);
};

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
	try {
		return await getGoogleAvailableCalendars(provider.accessToken);
	} catch (error) {
		if (error instanceof Error && error.message.includes("401")) {
			handleAuthenticationError();
			throw new Error("認証が必要です。再度ログインしてください。");
		}
		throw error;
	}
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
		if (!member.calendarIds || member.calendarIds.length === 0) continue;

		for (const calendarId of member.calendarIds) {
			console.log(`📅 Fetching events for ${member.name} (${calendarId})`);

			const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
				calendarId,
			)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

			const fetchResult = await safeFetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			});

			if (!fetchResult.success) {
				console.error(
					`Failed to fetch events for ${member.name} (${calendarId}):`,
					fetchResult.error,
				);
				continue;
			}

			const response = fetchResult.data;
			if (!response.ok) {
				if (response.status === 401) {
					console.warn(
						`🔐 Authentication error for ${member.name}. Token may be expired.`,
					);
					handleAuthenticationError(calendarId);
					// 401エラーの場合は即座に処理を終了
					break;
				}
				console.error(
					`Failed to fetch events for ${member.name} (${calendarId}):`,
					response.status,
				);
				continue;
			}

			const jsonResult = await safeAsync(
				() => response.json(),
				`Failed to parse JSON for ${member.name} (${calendarId})`,
			);

			if (!jsonResult.success) {
				console.error(
					`JSON parse error for ${member.name} (${calendarId}):`,
					jsonResult.error,
				);
				continue;
			}

			const data = jsonResult.data;
			console.log(
				`📊 Found ${data.items?.length || 0} events for ${member.name} (${calendarId})`,
			);

			if (data.items) {
				const memberEvents = data.items.map(
					(event: Record<string, unknown>) => {
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
							calendarId: calendarId,
						};
					},
				);
				allEvents.push(...memberEvents);
			}
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
		if (response.status === 401) {
			console.warn(
				"🔐 Authentication error while fetching calendars. Token may be expired.",
			);
			handleAuthenticationError();
			throw new Error("401");
		}
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
