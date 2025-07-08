import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { EventDetailModal } from "./components/EventDetailModal";
import { useEventDetailModal } from "./components/EventDetailModal/useEventDetailModal";
import { TodayButton } from "./components/TodayButton";
import { TouchNavigationWrapper } from "./components/TouchNavigationWrapper";
import { DateNavigationProvider } from "./contexts/DateNavigationContext";

export const Calendar = () => {
	const { selectedEvent, isModalOpen, handleEventClick, handleModalClose } =
		useEventDetailModal();

	return (
		<DateNavigationProvider>
			<TouchNavigationWrapper>
				<CalendarGrid onEventClick={handleEventClick} />
				<CalendarHeader />
				<TodayButton />
			</TouchNavigationWrapper>
			<EventDetailModal
				event={selectedEvent}
				isOpen={isModalOpen}
				onClose={handleModalClose}
			/>
		</DateNavigationProvider>
	);
};
