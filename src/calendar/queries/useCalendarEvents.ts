import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchGapiMultipleCalendarEvents } from "../gapiCalendarApi";
import { mockEvents } from "../mockData";
import type { CalendarEvent, FamilyCalendarConfig } from "../types";
import { isAuthenticated } from "../gapiAuth";

interface UseCalendarEventsParams {
	date: Date;
	familyCalendars: FamilyCalendarConfig[];
	useMockData: boolean;
	enabled: boolean; // 認証状態やGAPI初期化完了を制御
}

export const useCalendarEvents = ({
	date,
	familyCalendars,
	useMockData,
	enabled,
}: UseCalendarEventsParams) => {
	const dateKey = format(date, "yyyy-MM-dd");

	return useQuery({
		queryKey: ["calendarEvents", dateKey, familyCalendars, useMockData],
		queryFn: async (): Promise<CalendarEvent[]> => {
			if (useMockData || !isAuthenticated()) {
				// モックデータを使用（CalendarEvent型に変換）
				console.log("モックデータを使用します");
				const calendarEvents: CalendarEvent[] = mockEvents.map((event) => ({
					...event,
					id: event.id || `mock-${Math.random()}`,
					description: event.description || "",
					location: event.location || "",
				}));
				return calendarEvents;
			}

			// 各家族メンバーの複数カレンダーを展開
			const calendarConfigs: { calendarId: string; member: string }[] = [];
			familyCalendars.forEach((familyConfig) => {
				familyConfig.calendarIds.forEach((calendarId) => {
					calendarConfigs.push({
						calendarId,
						member: familyConfig.member,
					});
				});
			});

			return await fetchGapiMultipleCalendarEvents(calendarConfigs, date);
		},
		enabled,
		staleTime: 5 * 60 * 1000, // 5分間はフレッシュ
		gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
		retry: (failureCount, error) => {
			// Google API エラーの場合はリトライしない
			if (error instanceof Error && error.message.includes("Google")) {
				return false;
			}
			return failureCount < 1;
		},
	});
};