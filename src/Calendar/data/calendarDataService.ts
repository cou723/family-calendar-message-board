import { SafeStorage } from "../shared/safeStorage";
import type { CalendarDataProvider } from "./calendarDataProvider";

/**
 * 認証状態に応じて適切なCalendarDataProviderを取得
 */
export const getCalendarDataProvider = (): CalendarDataProvider | null => {
	// localStorageから直接認証状態を確認（useGoogleAuthと同じ判定基準）
	const tokenResult = SafeStorage.getItem("google-access-token");
	const accessToken =
		tokenResult.success && tokenResult.data ? tokenResult.data : null;
	const isAuthenticated = !!accessToken;

	if (!tokenResult.success) {
		console.warn("アクセストークン取得失敗:", tokenResult.error);
	}

	if (isAuthenticated) {
		// 認証済みの場合はGoogleカレンダーから実データを取得
		console.log("📡 Using Google Calendar data provider for real data");
		return { type: "google", accessToken };
	}

	// 未認証の場合はnullを返す（認証が必要）
	console.log("🔒 Authentication required for Google Calendar access");
	return null;
};
