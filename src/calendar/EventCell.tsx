import { format } from "date-fns";
import type { ProcessedEvent } from "../google-calendar/types";

interface EventCellProps {
	event: ProcessedEvent;
	className?: string;
}

export const EventCell = ({ event, className = "" }: EventCellProps) => {
	const timeText = event.isAllDay
		? "終日"
		: `${format(event.startTime, "H:mm")}-${format(event.endTime, "H:mm")}`;

	return (
		<div
			className={`
				p-2 rounded-md text-white text-sm font-medium shadow-sm
				${className}
			`}
			style={{ backgroundColor: event.color }}
			title={`${event.title} (${timeText})`}
		>
			<div className="truncate font-semibold mb-1 text-base">
				{event.title}
			</div>
			<div className="text-xs opacity-90">
				{timeText}
			</div>
		</div>
	);
};