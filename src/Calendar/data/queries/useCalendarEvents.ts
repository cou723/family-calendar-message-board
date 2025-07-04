import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type {
	CalendarEvent,
	FamilyCalendarConfig,
	FamilyMember,
} from "../../shared/types";
import type { CalendarDataService } from "../CalendarDataService";

interface UseCalendarEventsParams {
	date: Date;
	familyCalendars: FamilyCalendarConfig[];
	dataService: CalendarDataService;
	enabled: boolean;
}

export const useCalendarEvents = ({
	date,
	familyCalendars,
	dataService,
	enabled,
}: UseCalendarEventsParams) => {
	const dateKey = format(date, "yyyy-MM-dd");

	return useQuery({
		queryKey: ["calendarEvents", dateKey, familyCalendars],
		queryFn: async (): Promise<CalendarEvent[]> => {
			// CalendarDataServiceを使用してデータプロバイダーを取得
			const dataProvider = await dataService.getDataProvider();

			// familyCalendarsをFamilyMember[]に変換
			const familyMembers: FamilyMember[] = familyCalendars.map((config) => ({
				member: config.member,
				name: config.name,
				color: config.color,
				calendarId: config.calendarIds[0] || "", // 最初のカレンダーIDを使用
			}));

			// データプロバイダーからイベントを取得
			return await dataProvider.getCalendarEvents(date, familyMembers);
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
