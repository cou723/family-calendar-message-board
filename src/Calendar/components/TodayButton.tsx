import { ActionIcon } from "@mantine/core";
import { useDateNavigation } from "../shared/useDateNavigation";

export const TodayButton = () => {
	const { actions } = useDateNavigation();

	return (
		<ActionIcon
			variant="outline"
			size={56}
			radius="xl"
			onClick={actions.goToToday}
			style={{
				position: "fixed",
				bottom: 24,
				right: 24,
				backgroundColor: "white",
				border: "2px solid #bfdbfe", // blue-200
				color: "#2563eb", // blue-600
				boxShadow:
					"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
				zIndex: 50,
				transition: "all 200ms ease",
				"&:hover": {
					backgroundColor: "#eff6ff", // blue-50
					borderColor: "#93c5fd", // blue-300
					color: "#1d4ed8", // blue-800
					boxShadow:
						"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // shadow-xl
				},
			}}
		>
			<span style={{ fontSize: "1.5rem" }}>📅</span>
		</ActionIcon>
	);
};
