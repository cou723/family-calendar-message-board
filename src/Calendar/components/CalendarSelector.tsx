import {
	Box,
	Button,
	ColorInput,
	ColorSwatch,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useCalendarList } from "../data/useCalendarList";
import type { FamilyCalendarConfig } from "../shared/types";

interface CalendarSelectorProps {
	calendar: FamilyCalendarConfig;
	onSave: (calendar: FamilyCalendarConfig) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const CalendarSelector = ({
	calendar,
	onSave,
	onCancel,
	isLoading = false,
}: CalendarSelectorProps) => {
	const [name, setName] = useState(calendar.name);
	const [calendarId, setCalendarId] = useState(calendar.calendarId);
	const [color, setColor] = useState(calendar.color);
	const { data: calendars, isLoading: isCalendarsLoading } = useCalendarList();

	const handleSave = () => {
		onSave({
			...calendar,
			name,
			calendarId,
			color,
		});
	};

	const predefinedColors = [
		"#1d4ed8", // blue-700
		"#dc2626", // red-600
		"#059669", // green-600
		"#d97706", // amber-600
		"#7c3aed", // violet-600
		"#0891b2", // cyan-600
		"#ea580c", // orange-600
		"#65a30d", // lime-600
	];

	const calendarOptions =
		calendars?.map((cal) => ({
			value: cal.id,
			label: cal.summary,
		})) || [];

	return (
		<Stack gap="md">
			<TextInput
				label="表示名"
				value={name}
				onChange={(e) => setName(e.currentTarget.value)}
				placeholder="家族メンバー名"
				disabled={isLoading}
				size="md"
			/>

			<Select
				label="カレンダー"
				value={calendarId}
				onChange={(value) => setCalendarId(value || "")}
				data={calendarOptions}
				placeholder="カレンダーを選択してください"
				disabled={isLoading || isCalendarsLoading}
				size="md"
			/>

			<Box>
				<Text size="sm" fw={500} mb="xs">
					色
				</Text>
				<Group gap="sm" mb="sm">
					{predefinedColors.map((presetColor) => (
						<ColorSwatch
							key={presetColor}
							color={presetColor}
							size={32}
							style={{
								cursor: "pointer",
								border:
									color === presetColor ? "2px solid #000" : "1px solid #ccc",
							}}
							onClick={() => setColor(presetColor)}
						/>
					))}
				</Group>
				<ColorInput
					value={color}
					onChange={setColor}
					format="hex"
					disabled={isLoading}
					size="md"
				/>
			</Box>

			<Group gap="sm">
				<Button
					leftSection={<Check size={16} />}
					onClick={handleSave}
					disabled={isLoading || !name.trim() || !calendarId}
					size="md"
				>
					保存
				</Button>
				<Button
					variant="outline"
					leftSection={<X size={16} />}
					onClick={onCancel}
					disabled={isLoading}
					size="md"
				>
					キャンセル
				</Button>
			</Group>
		</Stack>
	);
};
