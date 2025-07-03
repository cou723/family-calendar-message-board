import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchCalendarEvents } from "../../../api/calendar";
import { mockEvents } from "../../shared/mockData";
import type { CalendarEvent, FamilyCalendarConfig } from "../../shared/types";

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
			if (useMockData) {
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

			// 各家族メンバーの複数カレンダーからイベントを取得
			const allEvents: CalendarEvent[] = [];
			const timeMin = format(date, "yyyy-MM-dd'T'00:00:00.000'Z'");
			const timeMax = format(date, "yyyy-MM-dd'T'23:59:59.999'Z'");

			for (const familyConfig of familyCalendars) {
				for (const calendarId of familyConfig.calendarIds) {
					try {
						const events = await fetchCalendarEvents(calendarId, {
							timeMin,
							timeMax,
						});

						// メンバー情報を追加
						const eventsWithMember = events.map((event) => ({
							...event,
							member: familyConfig.member,
						}));

						allEvents.push(...eventsWithMember);
					} catch (error) {
						if (error instanceof Error && error.message === "UNAUTHORIZED") {
							throw error; // 認証エラーは上位に伝播
						}
						console.error(
							`カレンダー ${calendarId} のイベント取得エラー:`,
							error,
						);
					}
				}
			}

			return allEvents;
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
