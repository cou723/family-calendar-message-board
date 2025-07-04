import { SafeStorage } from "../shared/safeStorage";
import { GoogleCalendarDataProvider } from "./GoogleCalendarDataProvider";
import type { ICalendarDataProvider } from "./ICalendarDataProvider";
import { MockCalendarDataProvider } from "./MockCalendarDataProvider";

export class CalendarDataService {
	private dataProvider: ICalendarDataProvider | null = null;

	/**
	 * 認証状態に応じて適切なデータプロバイダーを取得
	 */
	async getDataProvider(): Promise<ICalendarDataProvider> {
		if (this.dataProvider) {
			return this.dataProvider;
		}

		// localStorageから直接認証状態を確認
		const tokenResult = SafeStorage.getItem("google-access-token");
		const accessToken = tokenResult.success ? tokenResult.data : null;
		const isAuthenticated = !!accessToken && accessToken !== "mock-token";

		if (!tokenResult.success) {
			console.warn("アクセストークン取得失敗:", tokenResult.error);
		}

		if (isAuthenticated) {
			// 認証済みの場合はGoogleカレンダーから実データを取得
			console.log("📡 Using GoogleCalendarDataProvider for real data");
			this.dataProvider = new GoogleCalendarDataProvider(accessToken);
		} else {
			// 未認証またはモックトークンの場合はモックデータを使用
			console.log("🎭 Using MockCalendarDataProvider for mock data");
			this.dataProvider = new MockCalendarDataProvider();
		}

		return this.dataProvider;
	}

	/**
	 * データプロバイダーをリセット（ログイン状態変更時に使用）
	 */
	resetDataProvider(): void {
		this.dataProvider = null;
	}
}
