import { useQuery } from "@tanstack/react-query";
import { useGoogleAuth } from "../../auth/useGoogleAuth";
import type { GoogleCalendarInfo } from "../shared/types";
import { getAvailableCalendars } from "./calendarDataProvider";

// Google Calendar APIからカレンダー一覧を取得
const fetchCalendarList = async (
	accessToken: string,
): Promise<GoogleCalendarInfo[]> => {
	const calendars = await getAvailableCalendars({
		type: "google",
		accessToken,
	});

	return calendars.map((calendar) => ({
		id: calendar.id,
		summary: calendar.name,
		description: "",
		primary: false,
		accessRole: "reader",
		backgroundColor: calendar.color,
	}));
};

export const useCalendarList = () => {
	const { user } = useGoogleAuth();

	return useQuery({
		queryKey: ["calendarList", user?.access_token],
		queryFn: () => fetchCalendarList(user?.access_token || ""),
		staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
		retry: 2,
		enabled: !!user?.access_token,
	});
};
