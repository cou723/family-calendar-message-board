import { format } from "date-fns";

interface TimeGridProps {
	startHour?: number;
	endHour?: number;
	className?: string;
}

export const TimeGrid = ({ 
	startHour = 6, 
	endHour = 23, 
	className = "" 
}: TimeGridProps) => {
	// 時間の配列を生成（6時〜23時）
	const hours = Array.from(
		{ length: endHour - startHour + 1 }, 
		(_, i) => startHour + i
	);

	return (
		<div className={`flex flex-col ${className}`}>
			{hours.map((hour) => (
				<div
					key={hour}
					className="h-20 border-b border-gray-200 flex items-center justify-center bg-gray-50"
				>
					<span className="text-lg font-medium text-gray-700">
						{format(new Date().setHours(hour, 0, 0, 0), "H:mm")}
					</span>
				</div>
			))}
		</div>
	);
};