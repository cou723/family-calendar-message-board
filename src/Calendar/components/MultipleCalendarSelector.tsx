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
			calendarId: "",
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
		<div className="space-y-4">
			{familyCalendars.map((calendar, index) => (
				<div
					key={calendar.id}
					className="border border-gray-200 rounded-lg p-4 bg-white"
				>
					<div className="flex items-center justify-between mb-3">
						<h4 className="font-medium text-gray-900">
							{calendar.name || `家族メンバー ${index + 1}`}
						</h4>
						<button
							type="button"
							onClick={() => handleRemoveCalendar(index)}
							className="text-red-500 hover:text-red-700 p-1"
							disabled={isLoading}
						>
							<X className="w-4 h-4" />
						</button>
					</div>

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
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<div
									className="w-4 h-4 rounded-full border border-gray-300"
									style={{ backgroundColor: calendar.color }}
								/>
								<span className="text-sm text-gray-600">
									{calendar.calendarId || "カレンダーが選択されていません"}
								</span>
							</div>
							<button
								type="button"
								onClick={() => setEditingIndex(index)}
								className="text-blue-600 hover:text-blue-800 text-sm"
								disabled={isLoading}
							>
								編集
							</button>
						</div>
					)}
				</div>
			))}

			{familyCalendars.length < 4 && (
				<button
					type="button"
					onClick={handleAddCalendar}
					className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center space-x-2"
					disabled={isLoading}
				>
					<Plus className="w-5 h-5" />
					<span>家族メンバーを追加</span>
				</button>
			)}
		</div>
	);
};
