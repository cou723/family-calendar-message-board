import { useMemo } from "react";
import type { FamilyCalendarConfig } from "../shared/types";
import { CalendarDataService } from "./CalendarDataService";
import { useCalendarEvents as useCalendarEventsQuery } from "./queries/useCalendarEvents";

interface UseCalendarEventsProps {
	currentDate: Date;
	familyCalendars: FamilyCalendarConfig[];
}

export const useCalendarEvents = ({
	currentDate,
	familyCalendars,
}: UseCalendarEventsProps) => {
	// CalendarDataServiceのインスタンスを作成（新しい認証システム使用）
	const dataService = useMemo(() => {
		return new CalendarDataService();
	}, []);

	const {
		data: events = [],
		isLoading: isLoadingEvents,
		error: eventsError,
		refetch: refetchEvents,
	} = useCalendarEventsQuery({
		date: currentDate,
		familyCalendars,
		dataService,
		enabled: true, // 常に有効（内部でモック/実データを切り替え）
	});

	/**
	 * イベントを手動で再取得（TanStack Queryのrefetchを使用）
	 */
	const loadEvents = async (): Promise<void> => {
		// データプロバイダーをリセットして再取得
		dataService.resetDataProvider();
		refetchEvents();
	};

	return {
		events,
		isLoadingEvents,
		eventsError: eventsError ? `イベント取得エラー: ${eventsError}` : null,
		loadEvents,
	};
};
