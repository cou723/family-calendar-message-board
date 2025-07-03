import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCalendarList } from "../../api/calendar";
import type { GoogleCalendarInfo } from "../types";

export const useCalendarListQuery = (enabled: boolean) => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["calendarList"],
		queryFn: async (): Promise<GoogleCalendarInfo[]> => {
			const calendarList = await fetchCalendarList();

			// プライマリカレンダーを最初に配置し、残りは名前順でソート
			return calendarList
				.map((calendar: unknown) => {
					const cal = calendar as Record<string, unknown>;
					return {
						id: cal.id as string,
						summary: (cal.summary as string) || (cal.id as string),
						primary: (cal.primary as boolean) || false,
						accessRole: (cal.accessRole as string) || "reader",
						backgroundColor: cal.backgroundColor as string,
					};
				})
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
