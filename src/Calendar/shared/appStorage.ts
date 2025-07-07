import { array, number, object, parse, string } from "valibot";
import { SafeStorage } from "./safeStorage";

/**
 * アプリケーション専用の型安全なストレージ層
 *
 * SafeStorageの上に構築され、以下の利点を提供：
 * - 型安全性: 各データの型が明確に定義される
 * - 暗号化の一貫性: 暗号化が必要なデータは自動的に暗号化される
 * - キーの管理: ストレージキーが一箇所に集約される
 * - エラーハンドリング: 統一されたエラーハンドリング
 */

// ストレージキーの型定義
export type StorageKey =
	| "google-access-token"
	| "google-user-email"
	| "google-user-name"
	| "encryption-key"
	| "timeRangeSettings"
	| "familyCalendarSettings";

// 各データの型定義
export interface GoogleAuthData {
	accessToken: string;
	email: string;
	name: string;
}

export interface TimeRangeSettings {
	startHour: number;
	endHour: number;
}

export interface FamilyCalendarSettings {
	familyCalendars: Array<{
		id: string;
		member: string;
		name: string;
		color: string;
		calendarIds: string[];
	}>;
}

// 暗号化が必要なキーの定義
const ENCRYPTED_KEYS: Set<StorageKey> = new Set([
	"google-access-token",
	"google-user-email",
	"google-user-name",
]);

// Valibotスキーマ定義
const TimeRangeSettingsSchema = object({
	startHour: number(),
	endHour: number(),
});

const FamilyCalendarItemSchema = object({
	id: string(),
	member: string(),
	name: string(),
	color: string(),
	calendarIds: array(string()),
});

const FamilyCalendarSettingsSchema = object({
	familyCalendars: array(FamilyCalendarItemSchema),
});

/**
 * アプリケーション専用のストレージクラス
 */
// biome-ignore lint/complexity/noStaticOnlyClass: アプリケーション専用のストレージ操作をまとめるためのクラス
export class AppStorage {
	/**
	 * Google認証データを取得
	 */
	static async getGoogleAuthData(): Promise<GoogleAuthData | null> {
		try {
			const [tokenResult, emailResult, nameResult] = await Promise.all([
				SafeStorage.getItemEncrypted("google-access-token"),
				SafeStorage.getItemEncrypted("google-user-email"),
				SafeStorage.getItemEncrypted("google-user-name"),
			]);

			if (!tokenResult.success || !tokenResult.data) {
				return null;
			}

			return {
				accessToken: tokenResult.data,
				email:
					emailResult.success && emailResult.data
						? emailResult.data
						: "unknown@example.com",
				name:
					nameResult.success && nameResult.data ? nameResult.data : "ユーザー",
			};
		} catch (error) {
			console.error("Google認証データ取得エラー:", error);
			return null;
		}
	}

	/**
	 * Google認証データを保存
	 */
	static async setGoogleAuthData(data: GoogleAuthData): Promise<boolean> {
		try {
			const [tokenResult, emailResult, nameResult] = await Promise.all([
				SafeStorage.setItemEncrypted("google-access-token", data.accessToken),
				SafeStorage.setItemEncrypted("google-user-email", data.email),
				SafeStorage.setItemEncrypted("google-user-name", data.name),
			]);

			if (!tokenResult.success) {
				console.error("アクセストークン保存失敗:", tokenResult.error);
				return false;
			}
			if (!emailResult.success) {
				console.error("メール保存失敗:", emailResult.error);
				return false;
			}
			if (!nameResult.success) {
				console.error("名前保存失敗:", nameResult.error);
				return false;
			}

			return true;
		} catch (error) {
			console.error("Google認証データ保存エラー:", error);
			return false;
		}
	}

	/**
	 * Google認証データを削除
	 */
	static clearGoogleAuthData(): boolean {
		try {
			const results = [
				SafeStorage.removeItem("google-access-token"),
				SafeStorage.removeItem("google-user-email"),
				SafeStorage.removeItem("google-user-name"),
				SafeStorage.removeItem("encryption-key"),
			];

			let success = true;
			results.forEach((result, index) => {
				if (!result.success) {
					const keys = [
						"google-access-token",
						"google-user-email",
						"google-user-name",
						"encryption-key",
					];
					console.error(`${keys[index]}削除失敗:`, result.error);
					success = false;
				}
			});

			return success;
		} catch (error) {
			console.error("Google認証データ削除エラー:", error);
			return false;
		}
	}

	/**
	 * 時間範囲設定を取得
	 */
	static getTimeRangeSettings(): TimeRangeSettings | null {
		try {
			const result = SafeStorage.getItem("timeRangeSettings");
			if (!result.success || !result.data) {
				return null;
			}

			const parsed = JSON.parse(result.data);

			// Valibotでバリデーション
			const validated = parse(TimeRangeSettingsSchema, parsed);
			return validated;
		} catch (error) {
			console.error("時間範囲設定取得エラー:", error);
			return null;
		}
	}

	/**
	 * 時間範囲設定を保存
	 */
	static setTimeRangeSettings(settings: TimeRangeSettings): boolean {
		try {
			const result = SafeStorage.setItem(
				"timeRangeSettings",
				JSON.stringify(settings),
			);
			if (!result.success) {
				console.error("時間範囲設定保存失敗:", result.error);
				return false;
			}
			return true;
		} catch (error) {
			console.error("時間範囲設定保存エラー:", error);
			return false;
		}
	}

	/**
	 * 家族カレンダー設定を取得
	 */
	static getFamilyCalendarSettings(): FamilyCalendarSettings | null {
		try {
			const result = SafeStorage.getItem("familyCalendarSettings");
			if (!result.success || !result.data) {
				return null;
			}

			const parsed = JSON.parse(result.data);

			// Valibotでバリデーション
			const validated = parse(FamilyCalendarSettingsSchema, parsed);
			return validated;
		} catch (error) {
			console.error("家族カレンダー設定取得・バリデーションエラー:", error);
			return null;
		}
	}

	/**
	 * 家族カレンダー設定を保存
	 */
	static setFamilyCalendarSettings(settings: FamilyCalendarSettings): boolean {
		try {
			const result = SafeStorage.setItem(
				"familyCalendarSettings",
				JSON.stringify(settings),
			);
			if (!result.success) {
				console.error("家族カレンダー設定保存失敗:", result.error);
				return false;
			}
			return true;
		} catch (error) {
			console.error("家族カレンダー設定保存エラー:", error);
			return false;
		}
	}

	/**
	 * 汎用的なメソッド（既存コードとの互換性のため）
	 * 新しいコードでは上記の専用メソッドを使用することを推奨
	 */
	static async getItem<T>(key: StorageKey): Promise<T | null> {
		try {
			const isEncrypted = ENCRYPTED_KEYS.has(key);
			const result = isEncrypted
				? await SafeStorage.getItemEncrypted(key)
				: SafeStorage.getItem(key);

			if (!result.success || !result.data) {
				return null;
			}

			// JSONデータの場合はパースを試行
			try {
				return JSON.parse(result.data);
			} catch {
				return result.data as T;
			}
		} catch (error) {
			console.error(`${key}取得エラー:`, error);
			return null;
		}
	}

	/**
	 * 汎用的なメソッド（既存コードとの互換性のため）
	 * 新しいコードでは上記の専用メソッドを使用することを推奨
	 */
	static async setItem<T>(key: StorageKey, value: T): Promise<boolean> {
		try {
			const isEncrypted = ENCRYPTED_KEYS.has(key);
			const data = typeof value === "string" ? value : JSON.stringify(value);

			const result = isEncrypted
				? await SafeStorage.setItemEncrypted(key, data)
				: SafeStorage.setItem(key, data);

			if (!result.success) {
				console.error(`${key}保存失敗:`, result.error);
				return false;
			}
			return true;
		} catch (error) {
			console.error(`${key}保存エラー:`, error);
			return false;
		}
	}
}
