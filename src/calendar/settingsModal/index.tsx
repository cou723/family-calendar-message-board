import { useState } from "react";
import { TimeRangeInput } from "./TimeRangeInput";
import { CalendarSettingsTab } from "./CalendarSettingsTab";
import type { FamilyCalendarConfig } from "../types";

interface SettingsModalProps {
	isSettingsOpen: boolean;
	setIsSettingsOpen: (value: boolean) => void;
	startHour: number;
	setStartHour: (value: number) => void;
	endHour: number;
	setEndHour: (value: number) => void;
	familyCalendars: FamilyCalendarConfig[];
	onUpdateCalendars: (calendars: FamilyCalendarConfig[]) => void;
}

export const SettingsModal = ({
	isSettingsOpen,
	setIsSettingsOpen,
	startHour,
	setStartHour,
	endHour,
	setEndHour,
	familyCalendars,
	onUpdateCalendars,
}: SettingsModalProps) => {
	const [activeTab, setActiveTab] = useState<"time" | "calendar">("time");

	if (!isSettingsOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			onClick={() => setIsSettingsOpen(false)}
		>
			<div
				className="bg-white rounded-lg p-6 w-[32rem] max-w-2xl max-h-[80vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-bold mb-4 text-center">設定</h2>

				{/* タブメニュー */}
				<div className="flex border-b border-gray-200 mb-6">
					<button
						onClick={() => setActiveTab("time")}
						className={`flex-1 px-4 py-2 text-center font-medium transition-colors ${
							activeTab === "time"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-gray-800"
						}`}
					>
						表示時間
					</button>
					<button
						onClick={() => setActiveTab("calendar")}
						className={`flex-1 px-4 py-2 text-center font-medium transition-colors ${
							activeTab === "calendar"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-gray-800"
						}`}
					>
						カレンダー
					</button>
				</div>

				{/* タブコンテンツ */}
				<div className="min-h-[200px]">
					{activeTab === "time" && (
						<div className="space-y-4">
							<TimeRangeInput
								label="開始時間"
								value={startHour}
								onChange={setStartHour}
							/>

							<TimeRangeInput
								label="終了時間"
								value={endHour}
								onChange={setEndHour}
							/>

							<div className="text-sm text-gray-600 text-center">
								表示時間: {endHour - startHour + 1}時間
							</div>
						</div>
					)}

					{activeTab === "calendar" && (
						<CalendarSettingsTab
							familyCalendars={familyCalendars}
							onUpdateCalendars={onUpdateCalendars}
						/>
					)}
				</div>

				<div className="flex justify-end space-x-2 mt-6">
					<button
						onClick={() => setIsSettingsOpen(false)}
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
					>
						閉じる
					</button>
				</div>
			</div>
		</div>
	);
};
