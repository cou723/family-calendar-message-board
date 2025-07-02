import { useEffect } from "react";
import { Button } from "react-aria-components";
import {
	useCurrentDate,
	useGoogleCalendarInit,
	useFamilyCalendarData,
} from "./google-calendar";
import {
	DateNavigation,
	CalendarGrid,
	LoadingSpinner,
	ErrorMessage,
} from "./calendar";

export const CalendarPage = () => {
	const { currentDate, goToPreviousDay, goToNextDay, goToToday } = useCurrentDate();
	const {
		isInitialized,
		isSignedIn,
		error: authError,
		isLoading: authLoading,
		initialize,
		signIn,
	} = useGoogleCalendarInit();

	const {
		events,
		error: dataError,
		isLoading: dataLoading,
		reload,
	} = useFamilyCalendarData(currentDate);

	// 初期化を自動実行
	useEffect(() => {
		if (!isInitialized && !authLoading) {
			initialize();
		}
	}, [isInitialized, authLoading, initialize]);

	// 認証が必要な場合
	if (!isInitialized) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<LoadingSpinner size="lg" className="mb-6" />
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						初期化中...
					</h2>
					<p className="text-gray-600">
						Google Calendar APIを初期化しています
					</p>
				</div>
			</div>
		);
	}

	if (!isSignedIn) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
					<div className="text-6xl mb-6">📅</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-4">
						家族カレンダー
					</h1>
					<p className="text-lg text-gray-600 mb-8">
						Googleカレンダーと連携して家族の予定を表示します
					</p>
					<Button
						onPress={signIn}
						className="
							w-full px-6 py-4 text-lg font-semibold text-white 
							bg-blue-600 rounded-lg hover:bg-blue-700 
							focus:outline-none focus:ring-4 focus:ring-blue-300 
							transition-colors
						"
						isDisabled={authLoading}
					>
						{authLoading ? (
							<div className="flex items-center justify-center">
								<LoadingSpinner size="sm" className="mr-2" />
								認証中...
							</div>
						) : (
							"Googleでログイン"
						)}
					</Button>
					{authError && (
						<div className="mt-4">
							<ErrorMessage error={authError} onRetry={signIn} />
						</div>
					)}
				</div>
			</div>
		);
	}

	// データエラーがある場合
	if (dataError) {
		return (
			<div className="min-h-screen bg-gray-100 flex flex-col">
				<DateNavigation
					currentDate={currentDate}
					onPreviousDay={goToPreviousDay}
					onNextDay={goToNextDay}
					onToday={goToToday}
				/>
				<div className="flex-1 flex items-center justify-center p-8">
					<ErrorMessage error={dataError} onRetry={reload} />
				</div>
			</div>
		);
	}

	// メインカレンダー表示
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

			{/* フッター（リロードボタン） */}
			<div className="bg-white border-t border-gray-200 p-4">
				<div className="flex items-center justify-center">
					<Button
						onPress={reload}
						className="
							px-6 py-3 text-lg font-semibold text-blue-600 
							bg-blue-50 border-2 border-blue-200 rounded-lg 
							hover:bg-blue-100 focus:outline-none focus:ring-4 
							focus:ring-blue-300 transition-colors
						"
						isDisabled={dataLoading}
					>
						{dataLoading ? (
							<div className="flex items-center">
								<LoadingSpinner size="sm" className="mr-2" />
								更新中...
							</div>
						) : (
							"🔄 更新"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};