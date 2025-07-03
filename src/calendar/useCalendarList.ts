import { isAuthenticated } from "./gapiAuth";
import { useCalendarListQuery } from "./queries/useCalendarList";

export const useCalendarList = () => {
	const enabled = isAuthenticated();
	
	const {
		data: calendars = [],
		isLoading,
		error,
		refetchCalendarList,
	} = useCalendarListQuery(enabled);

	/**
	 * カレンダーリストをクリア
	 */
	const clearCalendarList = () => {
		// TanStack Queryではクエリを無効化してクリア
		refetchCalendarList();
	};

	return {
		calendars,
		isLoading,
		error: error ? `カレンダーリスト取得に失敗しました: ${error}` : null,
		fetchCalendarList: refetchCalendarList,
		clearCalendarList,
	};
};
