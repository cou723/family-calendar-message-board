import { useCurrentDate, useFamilyCalendarData } from "./google-calendar";
import { createMockDataFetcher } from "./google-calendar/mockData";
import { DateNavigation, CalendarGrid, LoadingSpinner } from "./calendar";

export const CalendarPageMock = () => {
	const { currentDate, goToPreviousDay, goToNextDay, goToToday } = useCurrentDate();
	
	// モックデータフェッチャーを使用
	const mockFetcher = createMockDataFetcher();
	const {
		events,
		error: dataError,
		isLoading: dataLoading,
		reload,
	} = useFamilyCalendarData(currentDate, mockFetcher);

	// エラー表示（モック版では簡略化）
	if (dataError) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold text-red-600 mb-4">
						エラーが発生しました
					</h2>
					<p className="text-gray-600 mb-4">
						{("message" in dataError ? dataError.message : "データの読み込みに失敗しました")}
					</p>
					<button
						type="button"
						onClick={reload}
						className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
					>
						再試行
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			{/* 日付ナビゲーション */}
			<DateNavigation
				currentDate={currentDate}
				onPreviousDay={goToPreviousDay}
				onNextDay={goToNextDay}
				onToday={goToToday}
			/>

			{/* データ読み込み中インジケーター */}
			{dataLoading && (
				<div className="bg-blue-50 border-b border-blue-200 p-4">
					<div className="flex items-center justify-center">
						<LoadingSpinner size="sm" className="mr-3" />
						<span className="text-lg text-blue-800">
							カレンダーデータを読み込み中...
						</span>
					</div>
				</div>
			)}

			{/* カレンダーグリッド */}
			<CalendarGrid
				events={events}
				startHour={6}
				endHour={23}
				className="flex-1"
			/>

			{/* フッター（リロードボタンとイベント数表示） */}
			<div className="bg-white border-t border-gray-200 p-4">
				<div className="flex items-center justify-between">
					<div className="text-lg text-gray-600">
						📅 {events.length}件の予定
					</div>
					<button
						type="button"
						onClick={reload}
						className="
							px-6 py-3 text-lg font-semibold text-blue-600 
							bg-blue-50 border-2 border-blue-200 rounded-lg 
							hover:bg-blue-100 focus:outline-none focus:ring-4 
							focus:ring-blue-300 transition-colors
						"
						disabled={dataLoading}
					>
						{dataLoading ? (
							<div className="flex items-center">
								<LoadingSpinner size="sm" className="mr-2" />
								更新中...
							</div>
						) : (
							"🔄 更新"
						)}
					</button>
				</div>
			</div>

			{/* デバッグ情報（モック版のみ） */}
			<div className="bg-yellow-50 border-t border-yellow-200 p-2">
				<div className="text-center text-sm text-yellow-800">
					🧪 モックデータ使用中 - {format(currentDate, "yyyy-MM-dd")}のデータを表示
				</div>
			</div>
		</div>
	);
};

// date-fnsのformatを簡易実装
const format = (date: Date, formatStr: string): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	
	return formatStr
		.replace('yyyy', String(year))
		.replace('MM', month)
		.replace('dd', day);
};