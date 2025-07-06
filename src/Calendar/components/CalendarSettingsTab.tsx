import { Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import type { FamilyCalendarConfig } from "../shared/types";
import { MultipleCalendarSelector } from "./MultipleCalendarSelector";

interface CalendarSettingsTabProps {
	familyCalendars: FamilyCalendarConfig[];
	onUpdateCalendars: (calendars: FamilyCalendarConfig[]) => void;
}

export const CalendarSettingsTab = ({
	familyCalendars,
	onUpdateCalendars,
}: CalendarSettingsTabProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdateCalendars = async (calendars: FamilyCalendarConfig[]) => {
		setIsLoading(true);
		try {
			await onUpdateCalendars(calendars);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Stack gap="xl">
			<Stack gap="md">
				<Title order={3}>家族カレンダーの設定</Title>
				<Text size="sm" c="dimmed">
					表示する家族メンバーのカレンダーを選択してください。
				</Text>
			</Stack>

			<MultipleCalendarSelector
				familyCalendars={familyCalendars}
				onUpdateCalendars={handleUpdateCalendars}
				isLoading={isLoading}
			/>

			<Stack gap="xs">
				<Text size="xs" c="dimmed">
					• 最大4人分のカレンダーを表示できます
				</Text>
				<Text size="xs" c="dimmed">
					• カレンダーの順序は表示順序に影響します
				</Text>
				<Text size="xs" c="dimmed">
					• 変更は自動的に保存されます
				</Text>
			</Stack>
		</Stack>
	);
};
