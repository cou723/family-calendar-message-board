import { useState } from "react";
import { getGapiCalendarClient, isAuthenticated } from "./gapiAuth";
import type { GoogleCalendarInfo } from "./types";

export const useCalendarList = () => {
	const [calendars, setCalendars] = useState<GoogleCalendarInfo[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Google Calendarからアクセス可能なカレンダーリストを取得
	 */
	const fetchCalendarList = async (): Promise<void> => {
		if (!isAuthenticated()) {
			setError("Google認証が必要です");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const calendar = getGapiCalendarClient();
			const response = await calendar.calendarList.list({
				minAccessRole: "reader", // 読み取り権限以上のカレンダーのみ
			});

			const calendarItems = response.result.items || [];
			
			// GoogleCalendarInfo型に変換
			const calendarInfoList: GoogleCalendarInfo[] = calendarItems.map((item: any) => ({
				id: item.id,
				summary: item.summary || item.id,
				description: item.description,
				primary: item.primary || false,
				accessRole: item.accessRole,
				backgroundColor: item.backgroundColor,
			}));

			// プライマリカレンダーを最初に、その後アルファベット順にソート
			const sortedCalendars = calendarInfoList.sort((a, b) => {
				if (a.primary && !b.primary) return -1;
				if (!a.primary && b.primary) return 1;
				return a.summary.localeCompare(b.summary);
			});

			setCalendars(sortedCalendars);
		} catch (error) {
			console.error("カレンダーリスト取得エラー:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			setError(`カレンダーリスト取得に失敗しました: ${errorMessage}`);
			setCalendars([]);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * カレンダーリストをクリア
	 */
	const clearCalendarList = () => {
		setCalendars([]);
		setError(null);
	};

	return {
		calendars,
		isLoading,
		error,
		fetchCalendarList,
		clearCalendarList,
	};
};