import { useEffect, useState } from "react";
import type {
	CalendarEvent,
	CellLayout,
	FamilyMember,
} from "../../shared/types";
import { getCellBackgroundClass } from "../utils/cellBackgroundUtils";
import { EventDisplay } from "./EventDisplay";

interface FamilyMemberColumnProps {
	familyMember: FamilyMember;
	cellLayout: CellLayout;
	events: CalendarEvent[];
}

export const FamilyMemberColumn = ({
	familyMember,
	cellLayout,
	events,
}: FamilyMemberColumnProps) => {
	const { startHour, endHour, cellHeight, headerHeight } = cellLayout;
	const { member, name, bgColor } = familyMember;
	const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

	useEffect(() => {
		const updateCurrentHour = () => {
			setCurrentHour(new Date().getHours());
		};

		const interval = setInterval(updateCurrentHour, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div
			key={member}
			className="flex-1 min-w-0 border-r border-blue-200 relative"
		>
			{/* ヘッダー */}
			<div
				className={`${bgColor} font-bold text-center border-b-2 border-blue-200 text-lg text-gray-800 flex items-center justify-center`}
				style={{ height: `${headerHeight}px` }}
			>
				{name}
			</div>

			{/* 時間スロットの背景 */}
			{Array.from(
				{ length: endHour - startHour + 1 },
				(_, i) => i + startHour,
			).map((hour) => (
				<div
					key={`bg-${member}-${hour}`}
					className={`border-b border-blue-200 ${getCellBackgroundClass({ hour, isCurrentHour: hour === currentHour })}`}
					style={{ height: `${cellHeight}px` }}
				/>
			))}

			{/* イベント表示（絶対位置） */}
			<EventDisplay
				member={member}
				startHour={startHour}
				cellHeight={cellHeight}
				headerHeight={headerHeight}
				events={events}
			/>
		</div>
	);
};
