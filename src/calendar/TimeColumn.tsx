import type { CellLayout } from "./types";

interface TimeColumnProps {
	cellLayout: CellLayout;
}

export const TimeColumn = ({ cellLayout }: TimeColumnProps) => {
	const { startHour, endHour, cellHeight, headerHeight } = cellLayout;
	return (
		<div className="w-14 bg-blue-50 border-r-2 border-blue-200 flex-shrink-0">
			<div
				className="font-bold text-center border-b-2 border-blue-200 text-lg bg-blue-100 text-blue-900 flex items-center justify-center"
				style={{ height: `${headerHeight}px` }}
			>
				時間
			</div>
			{Array.from(
				{ length: endHour - startHour + 1 },
				(_, i) => i + startHour,
			).map((hour) => (
				<div
					key={`time-${hour}`}
					className="border-b border-blue-200 text-center text-lg text-blue-800 flex items-center justify-center font-medium"
					style={{ height: `${cellHeight}px` }}
				>
					{hour}
				</div>
			))}
		</div>
	);
};
