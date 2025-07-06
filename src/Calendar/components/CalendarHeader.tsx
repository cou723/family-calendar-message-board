import { ActionIcon, Paper, Title } from "@mantine/core";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useDateNavigation } from "../shared/useDateNavigation";

export const CalendarHeader = () => {
	const { currentDate } = useDateNavigation();
	const navigate = useNavigate();

	return (
		<Paper
			shadow="sm"
			p="md"
			style={{
				flexShrink: 0,
				position: "relative",
				backgroundColor: "white",
			}}
		>
			<Paper
				p="lg"
				radius="md"
				style={{
					textAlign: "center",
					backgroundColor: currentDate.isDateChanging ? "#dcfce7" : "#eff6ff", // green-100 : blue-50
					transform: currentDate.isDateChanging ? "scale(1.05)" : "scale(1)",
					transition: "all 300ms ease",
				}}
			>
				<Title
					order={1}
					size="2xl"
					style={{
						color: currentDate.isDateChanging ? "#14532d" : "#1e40af", // green-800 : blue-800
					}}
				>
					{format(currentDate.date, "yyyy/M/d", { locale: ja })} (
					{format(currentDate.date, "E", { locale: ja })})
				</Title>
			</Paper>

			{/* 設定ボタン */}
			<ActionIcon
				variant="outline"
				size="xl"
				radius="xl"
				onClick={() => navigate("/settings")}
				style={{
					position: "absolute",
					top: 16,
					right: 16,
					transition: "all 200ms ease",
				}}
			>
				<span style={{ fontSize: "1.125rem" }}>⚙️</span>
			</ActionIcon>
		</Paper>
	);
};
