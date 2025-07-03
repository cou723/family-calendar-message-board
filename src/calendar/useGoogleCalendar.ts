import { useEffect, useState } from "react";
import { AuthClient } from "../api/auth";
import { useCalendarEvents } from "./queries/useCalendarEvents";
import type { FamilyCalendarConfig } from "./types";

const authClient = new AuthClient();

export const useGoogleCalendar = (currentDate: Date) => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
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

		// デフォルト設定（設定モーダルから変更可能）
		return [
			{
				member: "father",
				calendarIds: ["primary"],
				name: "お父さん",
				bgColor: "bg-blue-100",
			},
			{
				member: "mother",
				calendarIds: ["primary"],
				name: "お母さん",
				bgColor: "bg-red-100",
			},
			{
				member: "son1",
				calendarIds: ["primary"],
				name: "長男",
				bgColor: "bg-green-100",
			},
			{
				member: "son2",
				calendarIds: ["primary"],
				name: "次男",
				bgColor: "bg-yellow-100",
			},
		];
	});

	// 認証状態の初期チェック
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const authenticated = await authClient.checkAuthStatus();
			setIsAuthenticated(authenticated);
			if (!authenticated) {
				setUseMockData(true);
				setAuthError("認証が必要です。モックデータを使用します。");
			}
		} catch (error) {
			console.error("認証状態確認エラー:", error);
			setIsAuthenticated(false);
			setUseMockData(true);
			setAuthError("認証状態の確認に失敗しました。モックデータを使用します。");
		}
	};

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
		enabled: useMockData || isAuthenticated,
	});

	/**
	 * Google認証を実行
	 */
	const authenticate = async (): Promise<boolean> => {
		setIsAuthenticating(true);
		setAuthError(null);

		try {
			await authClient.login();
			return true;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			setAuthError(`認証エラー: ${errorMessage}。モックデータを使用します。`);
			setUseMockData(true);
			return false;
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
	 * ログアウト処理
	 */
	const handleLogout = async () => {
		try {
			await authClient.logout();
			setIsAuthenticated(false);
			setUseMockData(true);
			setAuthError("ログアウトしました。モックデータを使用します。");
		} catch (error) {
			console.error("ログアウトエラー:", error);
		}
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
		isAuthenticated: useMockData || isAuthenticated,
		isAuthenticating,
		authError,
		authenticate,
		logout: handleLogout,

		// イベント関連
		events,
		isLoadingEvents,
		eventsError: eventsError ? `イベント取得エラー: ${eventsError}` : null,
		loadEvents,

		// 設定・状態
		familyCalendars,
		updateFamilyCalendars,
		useMockData,
		isGapiInitialized: true, // 新システムでは常にtrue
	};
};
