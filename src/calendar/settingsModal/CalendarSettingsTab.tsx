import type { FamilyCalendarConfig } from "../types";
import { MultipleCalendarSelector } from "./MultipleCalendarSelector";

interface CalendarSettingsTabProps {
	familyCalendars: FamilyCalendarConfig[];
	onUpdateCalendars: (calendars: FamilyCalendarConfig[]) => void;
}

export const CalendarSettingsTab = ({
	familyCalendars,
	onUpdateCalendars,
}: CalendarSettingsTabProps) => {
	const handleCalendarIdsChange = (
		member: string,
		newCalendarIds: string[],
	) => {
		const updatedCalendars = familyCalendars.map((calendar) =>
			calendar.member === member
				? { ...calendar, calendarIds: newCalendarIds }
				: calendar,
		);
		onUpdateCalendars(updatedCalendars);
	};

	return (
		<div className="space-y-6">
			<div className="text-lg font-semibold text-gray-800 mb-4">
				カレンダー設定
			</div>

			{familyCalendars.map((calendar) => (
				<div key={calendar.member} className="bg-gray-50 rounded-lg p-4">
					<MultipleCalendarSelector
						calendarIds={calendar.calendarIds}
						onChange={(newCalendarIds) =>
							handleCalendarIdsChange(calendar.member, newCalendarIds)
						}
						memberName={calendar.name}
					/>
				</div>
			))}

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="text-sm text-blue-800">
					<strong>複数カレンダー機能：</strong>
					<ul className="mt-2 space-y-1 list-disc list-inside">
						<li>「+ カレンダー追加」で複数のカレンダーを設定可能</li>
						<li>複数カレンダーのイベントは自動的にマージされて表示</li>
						<li>例：仕事用カレンダー + プライベートカレンダー</li>
						<li>不要なカレンダーは🗑️ボタンで削除可能</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
