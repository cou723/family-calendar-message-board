import type { ProcessedEvent } from "../google-calendar/types";
import type { FamilyMember } from "../google-calendar/types";
import { EventCell } from "./EventCell";

interface FamilyMemberColumnProps {
	member: FamilyMember;
	events: ProcessedEvent[];
	startHour?: number;
	endHour?: number;
	className?: string;
}

export const FamilyMemberColumn = ({
	member,
	events,
	startHour = 6,
	endHour = 23,
	className = "",
}: FamilyMemberColumnProps) => {
	// 時間の配列を生成
	const hours = Array.from(
		{ length: endHour - startHour + 1 },
		(_, i) => startHour + i
	);

	// この時間に該当するイベントを取得する関数
	const getEventsForHour = (hour: number): ProcessedEvent[] => {
		return events.filter((event) => {
			if (event.isAllDay) return hour === startHour; // 終日イベントは最初の時間枠に表示
			
			const eventStartHour = event.startTime.getHours();
			const eventEndHour = event.endTime.getHours();
			
			return eventStartHour <= hour && hour < eventEndHour;
		});
	};

	return (
		<div className={`flex flex-col ${className}`}>
			{/* メンバー名ヘッダー */}
			<div 
				className="h-16 flex items-center justify-center text-xl font-bold text-white border-b-2 border-white"
				style={{ backgroundColor: member.color }}
			>
				{member.name}
			</div>

			{/* 時間別のイベント表示 */}
			{hours.map((hour) => {
				const hourEvents = getEventsForHour(hour);
				
				return (
					<div
						key={hour}
						className="h-20 border-b border-gray-200 p-1 relative bg-white"
					>
						{hourEvents.length > 0 ? (
							<div className="space-y-1">
								{hourEvents.map((event) => (
									<EventCell
										key={event.id}
										event={event}
										className="text-xs"
									/>
								))}
							</div>
						) : (
							<div className="h-full flex items-center justify-center text-gray-300">
								{/* 空の時間枠 */}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};