import { useState, useEffect } from "react";
import type { CellLayout } from "./types";
import { getTimeColumnBackgroundClass } from "./utils/cellBackgroundUtils";

interface TimeColumnProps {
	cellLayout: CellLayout;
}

export const TimeColumn = ({ cellLayout }: TimeColumnProps) => {
	const { startHour, endHour, cellHeight, headerHeight } = cellLayout;
	const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

	useEffect(() => {
		const updateCurrentHour = () => {
			setCurrentHour(new Date().getHours());
		};

		const interval = setInterval(updateCurrentHour, 60000);
		return () => clearInterval(interval);
	}, []);
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
			).map((hour) => {
				const isCurrentHour = hour === currentHour;
				const backgroundClass = getTimeColumnBackgroundClass({ hour, isCurrentHour });
				return (
					<div
						key={`time-${hour}`}
						className={`border-b border-blue-200 text-center text-lg flex items-center justify-center font-medium ${backgroundClass}`}
						style={{ height: `${cellHeight}px` }}
					>
						{hour}
					</div>
				);
			})}
		</div>
	);
};
