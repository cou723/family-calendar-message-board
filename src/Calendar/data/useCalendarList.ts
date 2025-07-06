import { useQuery } from "@tanstack/react-query";
import type { GoogleCalendarInfo } from "../shared/types";

// Google Calendar APIからカレンダー一覧を取得
const fetchCalendarList = async (): Promise<GoogleCalendarInfo[]> => {
	try {
		const response = await window.gapi.client.calendar.calendarList.list({
			maxResults: 50,
			showHidden: false,
		});

		if (!response.result?.items) {
			return [];
		}

		return response.result.items.map((item) => ({
			id: item.id || "",
			summary: item.summary || "",
			description: item.description,
			primary: item.primary || false,
			accessRole: item.accessRole || "",
			backgroundColor: item.backgroundColor,
		}));
	} catch (error) {
		console.error("カレンダー一覧の取得に失敗しました:", error);
		throw new Error("カレンダー一覧の取得に失敗しました");
	}
};

export const useCalendarList = () => {
	return useQuery({
		queryKey: ["calendarList"],
		queryFn: fetchCalendarList,
		staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
		retry: 2,
		enabled: typeof window !== "undefined" && !!window.gapi?.client?.calendar,
	});
};
