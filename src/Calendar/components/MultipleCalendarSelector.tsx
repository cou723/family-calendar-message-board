import {
	ActionIcon,
	Button,
	ColorSwatch,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { FamilyCalendarConfig } from "../shared/types";
import { CalendarSelector } from "./CalendarSelector";

interface MultipleCalendarSelectorProps {
	familyCalendars: FamilyCalendarConfig[];
	onUpdateCalendars: (calendars: FamilyCalendarConfig[]) => void;
	isLoading?: boolean;
}

export const MultipleCalendarSelector = ({
	familyCalendars,
	onUpdateCalendars,
	isLoading = false,
}: MultipleCalendarSelectorProps) => {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const handleAddCalendar = () => {
		if (familyCalendars.length >= 4) return;

		const newCalendar: FamilyCalendarConfig = {
			id: `new-${Date.now()}`,
			member: `member-${familyCalendars.length + 1}`,
			name: `家族メンバー ${familyCalendars.length + 1}`,
			calendarIds: [],
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
		};

		onUpdateCalendars([...familyCalendars, newCalendar]);
		setEditingIndex(familyCalendars.length);
	};

	const handleUpdateCalendar = (
		index: number,
		calendar: FamilyCalendarConfig,
	) => {
		const updated = [...familyCalendars];
		updated[index] = calendar;
		onUpdateCalendars(updated);
		setEditingIndex(null);
	};

	const handleRemoveCalendar = (index: number) => {
		const updated = familyCalendars.filter((_, i) => i !== index);
		onUpdateCalendars(updated);
		setEditingIndex(null);
	};

	return (
		<Stack gap="md">
			{familyCalendars.map((calendar, index) => (
				<Paper key={calendar.id} p="md" withBorder radius="md">
					<Group justify="space-between" mb="sm">
						<Title order={4}>
							{calendar.name || `家族メンバー ${index + 1}`}
						</Title>
						<ActionIcon
							color="red"
							variant="subtle"
							onClick={() => handleRemoveCalendar(index)}
							disabled={isLoading}
						>
							<X size={16} />
						</ActionIcon>
					</Group>

					{editingIndex === index ? (
						<CalendarSelector
							calendar={calendar}
							onSave={(updatedCalendar) =>
								handleUpdateCalendar(index, updatedCalendar)
							}
							onCancel={() => setEditingIndex(null)}
							isLoading={isLoading}
						/>
					) : (
						<Stack gap="sm">
							<Group gap="sm">
								<ColorSwatch color={calendar.color} size={16} />
								<Text size="sm" c="dimmed">
									{calendar.calendarIds.length > 0
										? `${calendar.calendarIds.length}個のカレンダーが選択されています`
										: "カレンダーが選択されていません"}
								</Text>
							</Group>
							<Button
								variant="subtle"
								size="sm"
								onClick={() => setEditingIndex(index)}
								disabled={isLoading}
							>
								編集
							</Button>
						</Stack>
					)}
				</Paper>
			))}

			{familyCalendars.length < 4 && (
				<Paper p="md" withBorder radius="md" style={{ borderStyle: "dashed" }}>
					<Button
						variant="subtle"
						fullWidth
						leftSection={<Plus size={20} />}
						onClick={handleAddCalendar}
						disabled={isLoading}
						size="lg"
					>
						家族メンバーを追加
					</Button>
				</Paper>
			)}
		</Stack>
	);
};
