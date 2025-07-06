import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarSettingsTab } from "../Calendar/components/CalendarSettingsTab";
import { TimeRangeInput } from "../Calendar/components/TimeRangeInput";
import { useFamilyCalendars } from "../Calendar/data/useFamilyCalendars";
import { useSettings } from "../Calendar/shared/useSettings";

export const SettingsPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<"time" | "calendar">("time");
	const { timeRange, settingsControl } = useSettings();
	const { familyCalendars, updateCalendars } = useFamilyCalendars();

	// 開始時間変更時の整合性チェック
	const handleStartHourChange = (newStartHour: number) => {
		settingsControl.setStartHour(newStartHour);
		// 開始時間が終了時間以上になった場合、終了時間を開始時間+1に調整
		if (newStartHour >= timeRange.endHour) {
			settingsControl.setEndHour(Math.min(newStartHour + 1, 23));
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-3xl mx-auto">
				{/* ヘッダー */}
				<div className="flex items-center mb-6">
					<button
						type="button"
						onClick={() => navigate("/")}
						className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						カレンダーに戻る
					</button>
				</div>

				{/* タイトル */}
				<h1 className="text-2xl font-bold text-gray-900 mb-8">設定</h1>

				{/* タブメニュー */}
				<div className="bg-white rounded-lg shadow-sm">
					<div className="flex border-b border-gray-200">
						<button
							type="button"
							onClick={() => setActiveTab("time")}
							className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
								activeTab === "time"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							表示時間
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("calendar")}
							className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
								activeTab === "calendar"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							カレンダー
						</button>
					</div>

					{/* タブコンテンツ */}
					<div className="p-6">
						{activeTab === "time" && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<TimeRangeInput
										label="開始時間"
										value={timeRange.startHour}
										onChange={handleStartHourChange}
									/>

									<TimeRangeInput
										label="終了時間"
										value={timeRange.endHour}
										onChange={settingsControl.setEndHour}
										min={timeRange.startHour + 1}
									/>
								</div>

								<div className="text-sm text-gray-600 text-center bg-gray-50 p-4 rounded-lg">
									表示時間: {timeRange.endHour - timeRange.startHour + 1}時間
								</div>

								<div className="text-sm text-gray-500">
									<p>• 表示する時間帯を設定できます</p>
									<p>
										•
										開始時間は0-23時、終了時間は開始時間+1-23時の範囲で選択可能です
									</p>
								</div>
							</div>
						)}

						{activeTab === "calendar" && (
							<CalendarSettingsTab
								familyCalendars={familyCalendars}
								onUpdateCalendars={updateCalendars}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
