import { gapi } from "gapi-script";
import type {
	CalendarConfig,
	CalendarError,
	CalendarEvent,
	DateRange,
	ProcessedEvent,
} from "./types";

export class GoogleCalendarApi {
	private isInitialized = false;
	private isSignedIn = false;

	/**
	 * Google API初期化
	 */
	async initialize(config: CalendarConfig): Promise<void> {
		try {
			await new Promise<void>((resolve, reject) => {
				gapi.load("client:auth2", {
					callback: resolve,
					onerror: reject,
				});
			});

			await gapi.client.init({
				apiKey: config.apiKey,
				clientId: config.clientId,
				discoveryDocs: config.discoveryDocs,
				scope: config.scope,
			});

			this.isInitialized = true;
			this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
		} catch (error) {
			throw this.createError(
				"INITIALIZATION_ERROR",
				`初期化に失敗しました: ${error}`,
			);
		}
	}

	/**
	 * Google認証サインイン
	 */
	async signIn(): Promise<void> {
		if (!this.isInitialized) {
			throw this.createError(
				"INITIALIZATION_ERROR",
				"APIが初期化されていません",
			);
		}

		try {
			const authInstance = gapi.auth2.getAuthInstance();
			await authInstance.signIn();
			this.isSignedIn = true;
		} catch (error) {
			throw this.createError("PERMISSION_ERROR", "認証に失敗しました");
		}
	}

	/**
	 * サインイン状態確認
	 */
	isAuthenticated(): boolean {
		return this.isInitialized && this.isSignedIn;
	}

	/**
	 * カレンダーイベント取得
	 */
	async fetchEvents(
		calendarId: string,
		dateRange: DateRange,
	): Promise<CalendarEvent[]> {
		if (!this.isAuthenticated()) {
			throw this.createError("PERMISSION_ERROR", "認証が必要です");
		}

		try {
			const response = await gapi.client.calendar.events.list({
				calendarId,
				timeMin: dateRange.start.toISOString(),
				timeMax: dateRange.end.toISOString(),
				singleEvents: true,
				orderBy: "startTime",
			});

			return response.result.items || [];
		} catch (error: unknown) {
			if (typeof error === "object" && error !== null && "status" in error) {
				const gapiError = error as { status: number; statusText: string };
				throw this.createError(
					"GOOGLE_API_ERROR",
					`API呼び出しエラー: ${gapiError.statusText}`,
					gapiError.status,
				);
			}
			throw this.createError(
				"NETWORK_ERROR",
				"ネットワークエラーが発生しました",
			);
		}
	}

	/**
	 * イベントをアプリケーション用に変換
	 */
	processEvent(
		event: CalendarEvent,
		memberId: string,
		color: string,
	): ProcessedEvent {
		const startTime = event.start?.dateTime
			? new Date(event.start.dateTime)
			: new Date(event.start?.date || "");

		const endTime = event.end?.dateTime
			? new Date(event.end.dateTime)
			: new Date(event.end?.date || "");

		const isAllDay = Boolean(event.start?.date);

		return {
			id: event.id || "",
			title: event.summary || "無題",
			startTime,
			endTime,
			isAllDay,
			memberId,
			color,
		};
	}

	/**
	 * エラーオブジェクト作成
	 */
	private createError(
		type: CalendarError["type"],
		message: string,
		code?: number,
	): CalendarError {
		switch (type) {
			case "GOOGLE_API_ERROR":
				return { type, message, code: code || 0 };
			case "PERMISSION_ERROR":
				return {
					type,
					requiredScope: "https://www.googleapis.com/auth/calendar.readonly",
				};
			default:
				return { type, message };
		}
	}
}
