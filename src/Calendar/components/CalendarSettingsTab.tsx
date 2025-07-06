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
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					家族カレンダーの設定
				</h3>
				<p className="text-sm text-gray-600 mb-4">
					表示する家族メンバーのカレンダーを選択してください。
				</p>
			</div>

			<MultipleCalendarSelector
				familyCalendars={familyCalendars}
				onUpdateCalendars={handleUpdateCalendars}
				isLoading={isLoading}
			/>

			<div className="text-xs text-gray-500 space-y-1">
				<p>• 最大4人分のカレンダーを表示できます</p>
				<p>• カレンダーの順序は表示順序に影響します</p>
				<p>• 変更は自動的に保存されます</p>
			</div>
		</div>
	);
};
