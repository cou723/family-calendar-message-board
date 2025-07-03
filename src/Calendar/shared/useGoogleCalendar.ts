import type { IAuthClient } from "../auth/IAuthClient";
import { useAuth } from "../auth/useAuth";
import { useCalendarEvents } from "../data/useCalendarEvents";
import { useFamilyCalendars } from "../data/useFamilyCalendars";

interface UseGoogleCalendarOptions {
	authClient?: IAuthClient;
}

export const useGoogleCalendar = (
	currentDate: Date,
	options: UseGoogleCalendarOptions = {},
) => {
	// 認証関連の状態管理
	const {
		isAuthenticated,
		isAuthenticating,
		authError,
		useMockData,
		authenticate,
		logout,
	} = useAuth({ authClient: options.authClient });

	// 家族カレンダー設定管理
	const { familyCalendars, updateFamilyCalendars } = useFamilyCalendars();

	// カレンダーイベント管理
	const { events, isLoadingEvents, eventsError, loadEvents } =
		useCalendarEvents({
			currentDate,
			familyCalendars,
			useMockData,
			isAuthenticated,
		});

	return {
		// 認証関連
		isAuthenticated,
		isAuthenticating,
		authError,
		authenticate,
		logout,

		// イベント関連
		events,
		isLoadingEvents,
		eventsError,
		loadEvents,

		// 設定・状態
		familyCalendars,
		updateFamilyCalendars,
		useMockData,
		isGapiInitialized: true, // 新システムでは常にtrue
	};
};
