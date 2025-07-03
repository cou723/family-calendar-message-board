import type { CalendarEvent } from "../../shared/types";
import { formatTime } from "../../shared/utils";

interface EventDisplayProps {
	member: string;
	startHour: number;
	cellHeight: number;
	headerHeight: number;
	events: CalendarEvent[];
}

export const EventDisplay = ({
	member,
	startHour,
	cellHeight,
	headerHeight,
	events,
}: EventDisplayProps) => {
	return (
		<>
			{events
				.filter((event) => event.member === member)
				.map((event, index) => {
					const duration = event.endHour - event.startHour;
					const topPosition =
						(event.startHour - startHour) * cellHeight + headerHeight;
					const height = duration * cellHeight;

					return (
						<div
							key={
								event.id
									? `event-${event.id}`
									: `event-${member}-${index}-${event.title}-${event.startHour}`
							}
							className={`absolute left-1 right-1 ${event.color} text-white rounded text-base px-3 py-2 shadow-sm z-10 overflow-hidden`}
							style={{
								top: `${topPosition}px`,
								height: `${height}px`,
								minHeight: `${Math.max(24, cellHeight * 0.8)}px`,
							}}
						>
							<div className="font-semibold leading-tight truncate">
								{event.title}
							</div>
							<div className="text-sm opacity-90 leading-tight">
								{formatTime(event.startHour)}-{formatTime(event.endHour)}
							</div>
						</div>
					);
				})}
		</>
	);
};
