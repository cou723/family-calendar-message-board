import type { ProcessedEvent } from "../google-calendar/types";
import { FAMILY_MEMBERS } from "../google-calendar/config";
import { TimeGrid } from "./TimeGrid";
import { FamilyMemberColumn } from "./FamilyMemberColumn";

interface CalendarGridProps {
	events: ProcessedEvent[];
	startHour?: number;
	endHour?: number;
	className?: string;
}

export const CalendarGrid = ({
	events,
	startHour = 6,
	endHour = 23,
	className = "",
}: CalendarGridProps) => {
	// メンバーごとにイベントを分類
	const eventsByMember = FAMILY_MEMBERS.reduce((acc, member) => {
		acc[member.id] = events.filter(event => event.memberId === member.id);
		return acc;
	}, {} as Record<string, ProcessedEvent[]>);

	return (
		<div className={`flex-1 overflow-auto ${className}`}>
			<div className="grid grid-cols-5 min-h-full">
				{/* 時間軸カラム */}
				<TimeGrid 
					startHour={startHour} 
					endHour={endHour}
					className="border-r-2 border-gray-300"
				/>

				{/* 家族メンバーカラム */}
				{FAMILY_MEMBERS.map((member) => (
					<FamilyMemberColumn
						key={member.id}
						member={member}
						events={eventsByMember[member.id] || []}
						startHour={startHour}
						endHour={endHour}
						className="border-r border-gray-200 last:border-r-0"
					/>
				))}
			</div>
		</div>
	);
};