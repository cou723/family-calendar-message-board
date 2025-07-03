import { useState } from "react";
import {
	authenticateGoogle,
	initializeGapi,
	isAuthenticated,
} from "./gapiAuth";
import { useCalendarEvents } from "./queries/useCalendarEvents";
import type { FamilyCalendarConfig } from "./types";

export const useGoogleCalendar = (currentDate: Date) => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [isGapiInitialized, setIsGapiInitialized] = useState(false);
	const [useMockData, setUseMockData] = useState(false);

	// 家族メンバーのカレンダー設定（ローカルストレージから読み込み）
	const [familyCalendars, setFamilyCalendars] = useState<
		FamilyCalendarConfig[]
	>(() => {
		try {
			const saved = localStorage.getItem("familyCalendarSettings");
			if (saved) {
				const parsed = JSON.parse(saved);
				// 旧形式（calendarId）から新形式（calendarIds）への移行
				return parsed.map((config: any) => {
					if (config.calendarId && !config.calendarIds) {
						return {
							...config,
							calendarIds: [config.calendarId],
						};
					}
					return config;
				});
			}
		} catch (error) {
			console.error("ローカルストレージからの設定読み込みエラー:", error);
		}

		// デフォルト設定
		return [
			{
				member: "father",
				calendarIds: [import.meta.env.VITE_FATHER_CALENDAR_ID || "primary"],
				name: "お父さん",
				bgColor: "bg-blue-100",
			},
			{
				member: "mother",
				calendarIds: [import.meta.env.VITE_MOTHER_CALENDAR_ID || "primary"],
				name: "お母さん",
				bgColor: "bg-red-100",
			},
			{
				member: "son1",
				calendarIds: [import.meta.env.VITE_SON1_CALENDAR_ID || "primary"],
				name: "長男",
				bgColor: "bg-green-100",
			},
			{
				member: "son2",
				calendarIds: [import.meta.env.VITE_SON2_CALENDAR_ID || "primary"],
				name: "次男",
				bgColor: "bg-yellow-100",
			},
		];
	});

	// TanStack Queryを使ってイベントを取得
	const {
		data: events = [],
		isLoading: isLoadingEvents,
		error: eventsError,
		refetch: refetchEvents,
	} = useCalendarEvents({
		date: currentDate,
		familyCalendars,
		useMockData,
		enabled: isGapiInitialized && (useMockData || isAuthenticated()),
	});

	/**
	 * Google API初期化
	 */
	const initializeApi = async (): Promise<boolean> => {
		try {
			const success = await initializeGapi();
			setIsGapiInitialized(success);
			if (!success) {
				setAuthError(
					"Google APIの初期化に失敗しました。モックデータを使用します。",
				);
				setUseMockData(true);
			}
			return success;
		} catch (error) {
			console.error("Google API初期化エラー:", error);
			setAuthError(
				"Google APIの初期化に失敗しました。モックデータを使用します。",
			);
			setUseMockData(true);
			setIsGapiInitialized(false);
			return false;
		}
	};

	/**
	 * Google認証を実行
	 */
	const authenticate = async (): Promise<boolean> => {
		if (!isGapiInitialized) {
			await initializeApi();
		}

		if (useMockData) {
			return true; // モックデータ使用時は認証成功とみなす
		}

		setIsAuthenticating(true);
		setAuthError(null);

		try {
			const success = await authenticateGoogle();
			if (!success) {
				setAuthError("Google認証に失敗しました。モックデータを使用します。");
				setUseMockData(true);
			}
			return true; // 認証失敗時もモックデータで継続
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			setAuthError(`認証エラー: ${errorMessage}。モックデータを使用します。`);
			setUseMockData(true);
			return true;
		} finally {
			setIsAuthenticating(false);
		}
	};

	/**
	 * イベントを手動で再取得（TanStack Queryのrefetchを使用）
	 */
	const loadEvents = async (): Promise<void> => {
		refetchEvents();
	};

	/**
	 * 家族カレンダー設定を更新
	 */
	const updateFamilyCalendars = (
		newCalendars: FamilyCalendarConfig[],
	): void => {
		setFamilyCalendars(newCalendars);
		try {
			localStorage.setItem(
				"familyCalendarSettings",
				JSON.stringify(newCalendars),
			);
		} catch (error) {
			console.error("ローカルストレージへの設定保存エラー:", error);
		}
	};

	return {
		// 認証関連
		isAuthenticated: useMockData || isAuthenticated(),
		isAuthenticating,
		authError,
		authenticate,

		// イベント関連
		events,
		isLoadingEvents,
		eventsError: eventsError ? `イベント取得エラー: ${eventsError}` : null,
		loadEvents,

		// 設定・状態
		familyCalendars,
		updateFamilyCalendars,
		useMockData,
		isGapiInitialized,
	};
};
