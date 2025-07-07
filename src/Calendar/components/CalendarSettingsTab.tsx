import { Stack, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
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
	const queryClient = useQueryClient();

	const handleUpdateCalendars = async (calendars: FamilyCalendarConfig[]) => {
		setIsLoading(true);
		try {
			await onUpdateCalendars(calendars);

			// カレンダー設定変更時にクエリキャッシュを無効化
			await queryClient.invalidateQueries({
				queryKey: ["calendarEvents"],
			});

			// 更なる確実性のためにカレンダーイベントをリフェッチ
			await queryClient.refetchQueries({
				queryKey: ["calendarEvents"],
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Stack gap="xl">
			<Stack gap="md">
				<Title order={3}>家族カレンダーの設定</Title>
				<Text size="sm" c="dimmed">
					表示する家族メンバーとそれぞれのカレンダーを選択してください。1人につき複数のカレンダーを選択できます。
				</Text>
			</Stack>

			<MultipleCalendarSelector
				familyCalendars={familyCalendars}
				onUpdateCalendars={handleUpdateCalendars}
				isLoading={isLoading}
			/>

			<Stack gap="xs">
				<Text size="xs" c="dimmed">
					• 最大4人分のメンバーを表示できます
				</Text>
				<Text size="xs" c="dimmed">
					• 1人につき複数のカレンダーを選択できます
				</Text>
				<Text size="xs" c="dimmed">
					• メンバーの順序は表示順序に影響します
				</Text>
				<Text size="xs" c="dimmed">
					• 変更は自動的に保存されます
				</Text>
			</Stack>
		</Stack>
	);
};
