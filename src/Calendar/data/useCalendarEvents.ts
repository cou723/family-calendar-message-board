import type { FamilyCalendarConfig } from "../shared/types";
import { useCalendarEvents as useCalendarEventsQuery } from "./queries/useCalendarEvents";

interface UseCalendarEventsProps {
	currentDate: Date;
	familyCalendars: FamilyCalendarConfig[];
}

export const useCalendarEvents = ({
	currentDate,
	familyCalendars,
}: UseCalendarEventsProps) => {
	const {
		data: events = [],
		isLoading: isLoadingEvents,
		error: eventsError,
		refetch: refetchEvents,
	} = useCalendarEventsQuery({
		date: currentDate,
		familyCalendars,
		enabled: true, // 常に有効（内部でモック/実データを切り替え）
	});

	/**
	 * イベントを手動で再取得（TanStack Queryのrefetchを使用）
	 */
	const loadEvents = async (): Promise<void> => {
		// TanStack Queryのrefetchを使用してデータを再取得
		refetchEvents();
	};

	return {
		events,
		isLoadingEvents,
		eventsError: eventsError ? `イベント取得エラー: ${eventsError}` : null,
		loadEvents,
	};
};
