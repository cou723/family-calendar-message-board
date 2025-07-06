import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type { CellLayout } from "../shared/types";
import { getTimeColumnBackgroundStyle } from "./utils/cellBackgroundUtils";

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
		<Box
			w={56}
			style={{
				backgroundColor: "#eff6ff", // blue-50
				borderRight: "2px solid #bfdbfe", // blue-200
				flexShrink: 0,
			}}
		>
			<Box
				ta="center"
				style={{
					height: `${headerHeight}px`,
					backgroundColor: "#dbeafe", // blue-100
					borderBottom: "2px solid #bfdbfe", // blue-200
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text fw={700} size="lg" c="#1e3a8a">
					時間
				</Text>
			</Box>
			<Box>
				{Array.from(
					{ length: endHour - startHour + 1 },
					(_, i) => i + startHour,
				).map((hour) => {
					const isCurrentHour = hour === currentHour;
					const backgroundStyle = getTimeColumnBackgroundStyle({
						hour,
						isCurrentHour,
					});
					return (
						<Box
							key={`time-${hour}`}
							ta="center"
							style={{
								height: `${cellHeight}px`,
								borderBottom: "1px solid #bfdbfe", // blue-200
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								...backgroundStyle,
							}}
						>
							<Text size="lg" fw={500}>
								{hour}
							</Text>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};
