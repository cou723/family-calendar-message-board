import { ActionIcon, Box, Title } from "@mantine/core";
import { differenceInDays, format } from "date-fns";
import { ja } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useDateNavigation } from "../shared/useDateNavigation";

const getRelativeDateLabel = (date: Date): string => {
	const now = new Date();
	// 時刻を00:00:00にリセットして日付のみで比較
	const dateOnly = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const diffDays = differenceInDays(dateOnly, nowOnly);

	switch (diffDays) {
		case 0:
			return "今日";
		case -1:
			return "昨日";
		case 1:
			return "明日";
		case 2:
			return "明後日";
		default:
			return "";
	}
};

export const CalendarFooter = () => {
	const { currentDate } = useDateNavigation();
	const navigate = useNavigate();
	const relativeLabel = getRelativeDateLabel(currentDate.date);

	return (
		<Box
			p="md"
			style={{
				flexShrink: 0,
				position: "relative",
				backgroundColor: "#f3f4f6", // gray-100
				textAlign: "center",
			}}
		>
			<Title
				order={1}
				size="2xl"
				style={{
					color: currentDate.isDateChanging ? "#14532d" : "#1e40af", // green-800 : blue-800
					transform: currentDate.isDateChanging ? "scale(1.05)" : "scale(1)",
					transition: "all 300ms ease",
				}}
			>
				{relativeLabel && `${relativeLabel} `}
				{format(currentDate.date, "yyyy/M/d", { locale: ja })} (
				{format(currentDate.date, "E", { locale: ja })})
			</Title>

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
		</Box>
	);
};
