import { useState } from "react";
import type { CalendarEvent } from "../../shared/types";

export const useEventDetailModal = () => {
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleEventClick = (event: CalendarEvent) => {
		setSelectedEvent(event);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedEvent(null);
	};

	return {
		selectedEvent,
		isModalOpen,
		handleEventClick,
		handleModalClose,
	};
};
