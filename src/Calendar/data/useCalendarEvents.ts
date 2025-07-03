import type { FamilyCalendarConfig } from "../shared/types";
import { useCalendarEvents as useCalendarEventsQuery } from "./queries/useCalendarEvents";

interface UseCalendarEventsProps {
	currentDate: Date;
	familyCalendars: FamilyCalendarConfig[];
	useMockData: boolean;
	isAuthenticated: boolean;
}

export const useCalendarEvents = ({
	currentDate,
	familyCalendars,
	useMockData,
	isAuthenticated,
}: UseCalendarEventsProps) => {
	const {
		data: events = [],
		isLoading: isLoadingEvents,
		error: eventsError,
		refetch: refetchEvents,
	} = useCalendarEventsQuery({
		date: currentDate,
		familyCalendars,
		useMockData,
		enabled: useMockData || isAuthenticated,
	});

	/**
	 * イベントを手動で再取得（TanStack Queryのrefetchを使用）
	 */
	const loadEvents = async (): Promise<void> => {
		refetchEvents();
	};

	return {
		events,
		isLoadingEvents,
		eventsError: eventsError ? `イベント取得エラー: ${eventsError}` : null,
		loadEvents,
	};
};
