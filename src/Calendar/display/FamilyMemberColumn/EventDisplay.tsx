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

					// 色の明度を判定して文字色を決定
					const isLightColor = (color: string): boolean => {
						const hex = color.replace("#", "");
						const r = parseInt(hex.substr(0, 2), 16);
						const g = parseInt(hex.substr(2, 2), 16);
						const b = parseInt(hex.substr(4, 2), 16);
						// 明度計算（0.299*R + 0.587*G + 0.114*B）
						const brightness = (r * 299 + g * 587 + b * 114) / 1000;
						return brightness > 155;
					};

					const textColor = isLightColor(event.color)
						? "text-gray-800"
						: "text-white";

					return (
						<div
							key={
								event.id
									? `event-${event.id}`
									: `event-${member}-${index}-${event.title}-${event.startHour}`
							}
							className={`absolute left-1 right-1 ${textColor} rounded text-base px-3 py-2 shadow-md z-10 overflow-hidden border border-gray-200`}
							style={{
								top: `${topPosition}px`,
								height: `${height}px`,
								minHeight: `${Math.max(24, cellHeight * 0.8)}px`,
								backgroundColor: event.color,
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
