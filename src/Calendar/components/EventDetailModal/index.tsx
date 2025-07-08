import { Box, Modal, Text } from "@mantine/core";
import type { CalendarEvent } from "../../shared/types";
import { formatTime } from "../../shared/utils";

interface EventDetailModalProps {
	event: CalendarEvent | null;
	isOpen: boolean;
	onClose: () => void;
}

export const EventDetailModal = ({
	event,
	isOpen,
	onClose,
}: EventDetailModalProps) => {
	if (!event) return null;

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title="予定の詳細"
			size="md"
			centered
		>
			<Box>
				<Text fw={600} size="lg" mb="md">
					{event.title}
				</Text>
				<Text size="md" mb="xs">
					開始時間: {formatTime(event.startHour)}
				</Text>
				<Text size="md">終了時間: {formatTime(event.endHour)}</Text>
			</Box>
		</Modal>
	);
};
