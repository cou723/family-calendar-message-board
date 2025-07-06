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

	return (
		<div className="space-y-4">
			<div>
				<label
					htmlFor="calendar-name"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					表示名
				</label>
				<input
					id="calendar-name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="家族メンバー名"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					disabled={isLoading}
				/>
			</div>

			<div>
				<label
					htmlFor="calendar-select"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					カレンダー
				</label>
				<select
					id="calendar-select"
					value={calendarId}
					onChange={(e) => setCalendarId(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					disabled={isLoading || isCalendarsLoading}
				>
					<option value="">カレンダーを選択してください</option>
					{calendars?.map((cal) => (
						<option key={cal.id} value={cal.id}>
							{cal.summary}
						</option>
					))}
				</select>
			</div>

			<div>
				<label
					htmlFor="calendar-color"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					色
				</label>
				<div className="flex space-x-2">
					{predefinedColors.map((presetColor) => (
						<button
							key={presetColor}
							type="button"
							onClick={() => setColor(presetColor)}
							className={`w-8 h-8 rounded-full border-2 ${
								color === presetColor ? "border-gray-800" : "border-gray-300"
							}`}
							style={{ backgroundColor: presetColor }}
							disabled={isLoading}
						/>
					))}
					<input
						id="calendar-color"
						type="color"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
						disabled={isLoading}
					/>
				</div>
			</div>

			<div className="flex space-x-2">
				<button
					type="button"
					onClick={handleSave}
					className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
					disabled={isLoading || !name.trim() || !calendarId}
				>
					<Check className="w-4 h-4" />
					<span>保存</span>
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="flex items-center space-x-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
					disabled={isLoading}
				>
					<X className="w-4 h-4" />
					<span>キャンセル</span>
				</button>
			</div>
		</div>
	);
};
