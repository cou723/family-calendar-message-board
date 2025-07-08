import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type {
	CalendarEvent,
	CellLayout,
	FamilyMember,
} from "../../shared/types";
import { getCellBackgroundStyle } from "../utils/cellBackgroundUtils";
import { EventDisplay } from "./EventDisplay";

interface FamilyMemberColumnProps {
	familyMember: FamilyMember;
	cellLayout: CellLayout;
	events: CalendarEvent[];
	onEventClick?: (event: CalendarEvent) => void;
}

export const FamilyMemberColumn = ({
	familyMember,
	cellLayout,
	events,
	onEventClick,
}: FamilyMemberColumnProps) => {
	const { startHour, endHour, cellHeight, headerHeight } = cellLayout;
	const { member, name, color } = familyMember;
	const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

	useEffect(() => {
		const updateCurrentHour = () => {
			setCurrentHour(new Date().getHours());
		};

		const interval = setInterval(updateCurrentHour, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Box
			key={member}
			flex={1}
			style={{
				minWidth: 0,
				position: "relative",
			}}
		>
			{/* ヘッダー */}
			<Box
				ta="center"
				style={{
					height: `${headerHeight}px`,
					backgroundColor: color,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text fw={700} size="lg" c="#374151">
					{name}
				</Text>
			</Box>

			{/* 時間スロットの背景 */}
			<Box style={{ position: "relative" }}>
				{Array.from(
					{ length: endHour - startHour + 1 },
					(_, i) => i + startHour,
				).map((hour) => {
					const backgroundStyle = getCellBackgroundStyle({
						hour,
						isCurrentHour: hour === currentHour,
					});
					return (
						<Box
							key={`bg-${member}-${hour}`}
							style={{
								height: `${cellHeight}px`,
								...backgroundStyle,
							}}
						/>
					);
				})}
			</Box>

			{/* イベント表示（絶対位置） */}
			<EventDisplay
				member={member}
				startHour={startHour}
				cellHeight={cellHeight}
				headerHeight={headerHeight}
				events={events}
				onEventClick={onEventClick}
			/>
		</Box>
	);
};
