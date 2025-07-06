import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type {
	CalendarEvent,
	FamilyCalendarConfig,
	FamilyMember,
} from "../../shared/types";
import { getCalendarEvents } from "../calendarDataProvider";
import { getCalendarDataProvider } from "../calendarDataService";

interface UseCalendarEventsParams {
	date: Date;
	familyCalendars: FamilyCalendarConfig[];
	enabled: boolean;
}

export const useCalendarEvents = ({
	date,
	familyCalendars,
	enabled,
}: UseCalendarEventsParams) => {
	const dateKey = format(date, "yyyy-MM-dd");

	return useQuery({
		queryKey: ["calendarEvents", dateKey, familyCalendars],
		queryFn: async (): Promise<CalendarEvent[]> => {
			// 認証状態に応じたデータプロバイダーを取得
			const dataProvider = getCalendarDataProvider();

			// 認証されていない場合は空配列を返す
			if (!dataProvider) {
				console.log("🔒 Not authenticated, returning empty events");
				return [];
			}

			// familyCalendarsをFamilyMember[]に変換
			const familyMembers: FamilyMember[] = familyCalendars.map((config) => ({
				member: config.member,
				name: config.name,
				color: config.color,
				calendarId: config.calendarIds[0] || "", // 最初のカレンダーIDを使用
			}));

			// 関数型アプローチでイベントを取得
			return await getCalendarEvents(dataProvider, date, familyMembers);
		},
		enabled,
		staleTime: 5 * 60 * 1000, // 5分間はフレッシュ
		gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
		retry: (failureCount, error) => {
			// 認証エラー（401）の場合はリトライしない
			if (error instanceof Error && error.message.includes("401")) {
				return false;
			}
			// 認証が必要というメッセージの場合もリトライしない
			if (error instanceof Error && error.message.includes("認証が必要です")) {
				return false;
			}
			// その他のエラーは1回までリトライ
			return failureCount < 1;
		},
	});
};
