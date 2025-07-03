import { useCallback, useEffect, useState } from "react";
import { GoogleCalendarApi } from "./api";
import { FAMILY_MEMBERS, GOOGLE_CALENDAR_CONFIG } from "./config";
import type {
	CalendarDataFetcher,
	CalendarError,
	DateRange,
	ProcessedEvent,
} from "./types";

// デフォルトのデータフェッチャー
const createDefaultFetcher = (api: GoogleCalendarApi): CalendarDataFetcher => ({
	fetchEvents: api.fetchEvents.bind(api),
	getCurrentDate: () => new Date(),
});

/**
 * Google Calendar API初期化フック
 */
export const useGoogleCalendarInit = () => {
	const [api] = useState(() => new GoogleCalendarApi());
	const [isInitialized, setIsInitialized] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [error, setError] = useState<CalendarError | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const initialize = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			await api.initialize(GOOGLE_CALENDAR_CONFIG);
			setIsInitialized(true);
			setIsSignedIn(api.isAuthenticated());
		} catch (err) {
			setError(err as CalendarError);
		} finally {
			setIsLoading(false);
		}
	}, [api]);

	const signIn = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			await api.signIn();
			setIsSignedIn(true);
		} catch (err) {
			setError(err as CalendarError);
		} finally {
			setIsLoading(false);
		}
	}, [api]);

	return {
		api,
		isInitialized,
		isSignedIn,
		error,
		isLoading,
		initialize,
		signIn,
	};
};

/**
 * 家族カレンダーデータ取得フック
 */
export const useFamilyCalendarData = (
	targetDate: Date,
	fetcher?: CalendarDataFetcher,
) => {
	const { api, isSignedIn } = useGoogleCalendarInit();
	const [events, setEvents] = useState<ProcessedEvent[]>([]);
	const [error, setError] = useState<CalendarError | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const defaultFetcher = createDefaultFetcher(api);
	const actualFetcher = fetcher || defaultFetcher;

	const loadEvents = useCallback(async () => {
		// モックフェッチャーが提供されている場合は認証をスキップ
		if (!fetcher && !isSignedIn) return;

		setIsLoading(true);
		setError(null);

		try {
			const dateRange: DateRange = {
				start: new Date(
					targetDate.getFullYear(),
					targetDate.getMonth(),
					targetDate.getDate(),
				),
				end: new Date(
					targetDate.getFullYear(),
					targetDate.getMonth(),
					targetDate.getDate() + 1,
				),
			};

			const allEvents: ProcessedEvent[] = [];

			// 各家族メンバーのイベントを並列取得
			const eventPromises = FAMILY_MEMBERS.map(async (member) => {
				try {
					const memberEvents = await actualFetcher.fetchEvents(
						member.calendarId,
						dateRange,
					);
					return memberEvents.map((event) =>
						api.processEvent(event, member.id, member.color),
					);
				} catch (memberError) {
					console.warn(`${member.name}のカレンダー取得に失敗:`, memberError);
					return [];
				}
			});

			const eventResults = await Promise.all(eventPromises);
			eventResults.forEach((memberEvents) => {
				allEvents.push(...memberEvents);
			});

			// 開始時間でソート
			allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
			setEvents(allEvents);
		} catch (err) {
			setError(err as CalendarError);
		} finally {
			setIsLoading(false);
		}
	}, [targetDate, isSignedIn, actualFetcher, api]);

	// targetDateが変更されたら自動でリロード
	useEffect(() => {
		loadEvents();
	}, [loadEvents]);

	return {
		events,
		error,
		isLoading,
		reload: loadEvents,
	};
};

/**
 * 現在の日付を管理するフック
 */
export const useCurrentDate = () => {
	const [currentDate, setCurrentDate] = useState(new Date());

	const goToPreviousDay = useCallback(() => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() - 1);
			return newDate;
		});
	}, []);

	const goToNextDay = useCallback(() => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() + 1);
			return newDate;
		});
	}, []);

	const goToToday = useCallback(() => {
		setCurrentDate(new Date());
	}, []);

	return {
		currentDate,
		goToPreviousDay,
		goToNextDay,
		goToToday,
	};
};
