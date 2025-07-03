import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGapiCalendarClient } from "../gapiAuth";
import type { GoogleCalendarInfo } from "../types";

export const useCalendarListQuery = (enabled: boolean) => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["calendarList"],
		queryFn: async (): Promise<GoogleCalendarInfo[]> => {
			const calendar = getGapiCalendarClient();

			const response = await calendar.calendarList.list({
				showHidden: false,
			});

			const calendarList = response.result.items || [];

			// プライマリカレンダーを最初に配置し、残りは名前順でソート
			return calendarList
				.map((calendar: any) => ({
					id: calendar.id,
					summary: calendar.summary || calendar.id,
					primary: calendar.primary || false,
					accessRole: calendar.accessRole || "reader",
					backgroundColor: calendar.backgroundColor,
				}))
				.sort((a: GoogleCalendarInfo, b: GoogleCalendarInfo) => {
					if (a.primary) return -1;
					if (b.primary) return 1;
					return a.summary.localeCompare(b.summary);
				});
		},
		enabled,
		staleTime: 15 * 60 * 1000, // 15分間はフレッシュ
		gcTime: 30 * 60 * 1000, // 30分間キャッシュ保持
	});

	const refetchCalendarList = () => {
		queryClient.invalidateQueries({
			queryKey: ["calendarList"],
		});
	};

	return {
		...query,
		refetchCalendarList,
	};
};