import {
	Alert,
	Box,
	Button,
	Container,
	Group,
	Paper,
	SimpleGrid,
	Stack,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarSettingsTab } from "../Calendar/components/CalendarSettingsTab";
import { TimeRangeInput } from "../Calendar/components/TimeRangeInput";
import { useFamilyCalendars } from "../Calendar/data/useFamilyCalendars";
import { useSettings } from "../Calendar/shared/useSettings";

export const SettingsPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"time" | "calendar">("time");
	const { timeRange, settingsControl } = useSettings();
	const { familyCalendars, updateCalendars } = useFamilyCalendars();

	// 開始時間変更時の整合性チェック
	const handleStartHourChange = (newStartHour: number) => {
		settingsControl.setStartHour(newStartHour);
		// 開始時間が終了時間以上になった場合、終了時間を開始時間+1に調整
		if (newStartHour >= timeRange.endHour) {
			settingsControl.setEndHour(Math.min(newStartHour + 1, 23));
		}
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
								<SimpleGrid cols={{ base: 1, md: 2 }}>
									<TimeRangeInput
										label="開始時間"
										value={timeRange.startHour}
										onChange={handleStartHourChange}
									/>

									<TimeRangeInput
										label="終了時間"
										value={timeRange.endHour}
										onChange={settingsControl.setEndHour}
										min={timeRange.startHour + 1}
									/>
								</SimpleGrid>

								<Alert variant="light" color="blue" radius="md">
									<Text size="md" ta="center">
										表示時間: {timeRange.endHour - timeRange.startHour + 1}時間
									</Text>
								</Alert>

								<Stack gap="xs">
									<Text size="sm" c="dimmed">
										• 表示する時間帯を設定できます
									</Text>
									<Text size="sm" c="dimmed">
										•
										開始時間は0-23時、終了時間は開始時間+1-23時の範囲で選択可能です
									</Text>
								</Stack>
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value="calendar">
							<CalendarSettingsTab
								familyCalendars={familyCalendars}
								onUpdateCalendars={updateCalendars}
							/>
						</Tabs.Panel>
					</Box>
				</Tabs>
			</Paper>
		</Container>
	);
};
