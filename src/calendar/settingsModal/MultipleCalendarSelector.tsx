import { CalendarSelector } from "./CalendarSelector";

interface MultipleCalendarSelectorProps {
	calendarIds: string[];
	onChange: (calendarIds: string[]) => void;
	memberName: string;
}

export const MultipleCalendarSelector = ({
	calendarIds,
	onChange,
	memberName,
}: MultipleCalendarSelectorProps) => {
	const addCalendar = () => {
		onChange([...calendarIds, ""]);
	};

	const removeCalendar = (index: number) => {
		const newCalendarIds = calendarIds.filter((_, i) => i !== index);
		onChange(newCalendarIds);
	};

	const updateCalendar = (index: number, newCalendarId: string) => {
		const newCalendarIds = [...calendarIds];
		newCalendarIds[index] = newCalendarId;
		onChange(newCalendarIds);
	};

	const resetToDefault = () => {
		onChange(["primary"]);
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<label className="text-base font-medium text-gray-700">
					{memberName}
				</label>
				<div className="flex gap-2">
					<button
						onClick={addCalendar}
						className="text-sm text-green-600 hover:text-green-800 transition-colors px-2 py-1 border border-green-600 rounded hover:bg-green-50"
					>
						+ カレンダー追加
					</button>
					<button
						onClick={resetToDefault}
						className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
					>
						デフォルトに戻す
					</button>
				</div>
			</div>

			<div className="space-y-2">
				{calendarIds.map((calendarId, index) => (
					<div key={index} className="flex items-start gap-2">
						<div className="flex-1">
							<CalendarSelector
								value={calendarId}
								onChange={(newCalendarId) =>
									updateCalendar(index, newCalendarId)
								}
								placeholder={`${memberName}のカレンダー ${index + 1}`}
							/>
						</div>
						{calendarIds.length > 1 && (
							<button
								onClick={() => removeCalendar(index)}
								className="flex-shrink-0 mt-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
								title="このカレンダーを削除"
							>
								🗑️
							</button>
						)}
					</div>
				))}
			</div>

			{calendarIds.length > 1 && (
				<div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
					💡
					複数のカレンダーが設定されています。すべてのカレンダーのイベントがマージして表示されます。
				</div>
			)}
		</div>
	);
};
