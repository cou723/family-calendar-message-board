import { Box, Text } from "@mantine/core";
import type { CalendarEvent } from "../../shared/types";
import { formatTime } from "../../shared/utils";

interface EventDisplayProps {
	member: string;
	startHour: number;
	cellHeight: number;
	headerHeight: number;
	events: CalendarEvent[];
	onEventClick?: (event: CalendarEvent) => void;
}

export const EventDisplay = ({
	member,
	startHour,
	cellHeight,
	headerHeight,
	events,
	onEventClick,
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

					const textColor = isLightColor(event.color) ? "#374151" : "#ffffff";

					return (
						<Box
							key={
								event.id
									? `event-${event.id}`
									: `event-${member}-${index}-${event.title}-${event.startHour}`
							}
							style={{
								position: "absolute",
								left: "4px",
								right: "4px",
								top: `${topPosition}px`,
								height: `${height}px`,
								minHeight: `${Math.max(32, cellHeight * 0.9)}px`,
								backgroundColor: event.color,
								color: textColor,
								borderRadius: "4px",
								padding: "0",
								boxShadow:
									"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
								zIndex: 10,
								overflow: "hidden",
								cursor: onEventClick ? "pointer" : "default",
							}}
							onClick={() => onEventClick?.(event)}
						>
							<Text
								fw={600}
								size="md"
								style={{
									lineHeight: "1.25",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{event.title}
							</Text>
							<Text
								size="sm"
								style={{
									lineHeight: "1.25",
									opacity: 0.9,
								}}
							>
								{formatTime(event.startHour)}-{formatTime(event.endHour)}
							</Text>
						</Box>
					);
				})}
		</>
	);
};
