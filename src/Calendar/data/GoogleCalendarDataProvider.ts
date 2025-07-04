import { format } from "date-fns";
import { safeAsync, safeFetch, safeSync } from "../shared/safeStorage";
import type { CalendarEvent, FamilyMember } from "../shared/types";
import type { ICalendarDataProvider } from "./ICalendarDataProvider";

export class GoogleCalendarDataProvider implements ICalendarDataProvider {
	private accessToken: string;

	constructor(accessToken: string) {
		this.accessToken = accessToken;
	}

	async getCalendarEvents(
		date: Date,
		familyMembers: FamilyMember[],
	): Promise<CalendarEvent[]> {
		const dateStr = format(date, "yyyy-MM-dd");
		const timeMin = `${dateStr}T00:00:00.000Z`;
		const timeMax = `${dateStr}T23:59:59.999Z`;

		const allEvents: CalendarEvent[] = [];

		for (const member of familyMembers) {
			if (!member.calendarId) continue;

			console.log(
				`📅 Fetching events for ${member.name} (${member.calendarId})`,
			);

			const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
				member.calendarId,
			)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

			const fetchResult = await safeFetch(url, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
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
							startHour: this.parseHour(startTimeStr),
							endHour: this.parseHour(endTimeStr),
							member: member.member,
							color: member.color,
							calendarId: member.calendarId,
						};
					},
				);
				allEvents.push(...memberEvents);
			}
		}

		console.log(`📊 Total events fetched: ${allEvents.length}`);
		return allEvents;
	}

	async getAvailableCalendars(): Promise<
		{ id: string; name: string; color?: string }[]
	> {
		const fetchResult = await safeFetch(
			"https://www.googleapis.com/calendar/v3/users/me/calendarList",
			{
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
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
	}

	private parseHour(dateTimeStr: string): number {
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
	}
}
