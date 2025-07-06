import {
	Alert,
	Box,
	Button,
	Container,
	Group,
	Paper,
	RangeSlider,
	Stack,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarSettingsTab } from "../Calendar/components/CalendarSettingsTab";
import { useSettings } from "../Calendar/shared/useSettings";

export const SettingsPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"time" | "calendar">("time");
	const { timeRange, settingsControl, familyCalendars, setFamilyCalendars } =
		useSettings();

	// 時間範囲変更時の処理
	const handleTimeRangeChange = (value: [number, number]) => {
		settingsControl.setTimeRange(value);
	};

	return (
		<Container size="lg" py="xl">
			{/* ヘッダー */}
			<Group mb="xl">
				<Button
					variant="subtle"
					leftSection={<ArrowLeft size={20} />}
					onClick={() => navigate("/")}
					size="md"
				>
					カレンダーに戻る
				</Button>
			</Group>

			{/* タイトル */}
			<Title order={1} mb="xl">
				設定
			</Title>

			{/* タブメニュー */}
			<Paper shadow="sm" radius="md" withBorder>
				<Tabs
					value={activeTab}
					onChange={(value) => setActiveTab(value as "time" | "calendar")}
				>
					<Tabs.List>
						<Tabs.Tab value="time" fw={500} size="lg">
							表示時間
						</Tabs.Tab>
						<Tabs.Tab value="calendar" fw={500} size="lg">
							カレンダー
						</Tabs.Tab>
					</Tabs.List>

					<Box p="xl">
						<Tabs.Panel value="time">
							<Stack gap="xl">
								<Box>
									<Text size="lg" fw={500} mb="md">
										表示時間範囲
									</Text>
									<RangeSlider
										value={[timeRange.startHour, timeRange.endHour]}
										onChange={handleTimeRangeChange}
										min={0}
										max={23}
										step={1}
										minRange={1}
										size="xl"
										color="blue"
										marks={[
											{ value: 0, label: "0時" },
											{ value: 6, label: "6時" },
											{ value: 12, label: "12時" },
											{ value: 18, label: "18時" },
											{ value: 23, label: "23時" },
										]}
									/>
								</Box>

								<Alert variant="light" color="blue" radius="md">
									<Text size="md" ta="center">
										表示時間: {timeRange.startHour}時 〜 {timeRange.endHour}時 (
										{timeRange.endHour - timeRange.startHour + 1}時間)
									</Text>
								</Alert>

								<Stack gap="xs">
									<Text size="sm" c="dimmed">
										• スライダーで表示する時間帯を設定できます
									</Text>
									<Text size="sm" c="dimmed">
										• 最低1時間の範囲は必要です
									</Text>
								</Stack>
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value="calendar">
							<CalendarSettingsTab
								familyCalendars={familyCalendars}
								onUpdateCalendars={setFamilyCalendars}
							/>
						</Tabs.Panel>
					</Box>
				</Tabs>
			</Paper>
		</Container>
	);
};
