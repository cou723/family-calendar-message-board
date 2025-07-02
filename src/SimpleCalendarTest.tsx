import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const SimpleCalendarTest = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [startX, setStartX] = useState<number | null>(null);
	const [isDateChanging, setIsDateChanging] = useState(false);
	const [cellHeight, setCellHeight] = useState(32);
	const [headerHeight, setHeaderHeight] = useState(48);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [startHour, setStartHour] = useState(6);
	const [endHour, setEndHour] = useState(23);

	// 画面サイズに応じてセルの高さを動的に計算
	useEffect(() => {
		const calculateCellHeight = () => {
			const screenHeight = window.innerHeight;
			
			// 固定される部分の高さを正確に計算（余裕を持った値）
			const topHeaderHeight = 110; // 日付ヘッダー部分（実測ベース + 余裕）
			const safetyMargin = 10; // 安全マージン
			const reservedHeight = topHeaderHeight + safetyMargin;
			
			const availableHeight = screenHeight - reservedHeight;
			const totalHours = endHour - startHour + 1; // 動的な時間範囲
			const totalRowsIncludingHeader = totalHours + 1; // 時間セル + グリッドヘッダー
			
			// 利用可能高さを全行数で分割（グリッドヘッダーも含む）
			const averageRowHeight = Math.floor(availableHeight / totalRowsIncludingHeader);
			
			// セル高さとヘッダー高さを計算（最小値保証）
			const finalCellHeight = Math.max(18, averageRowHeight);
			const finalHeaderHeight = Math.max(35, averageRowHeight);
			
			setCellHeight(finalCellHeight);
			setHeaderHeight(finalHeaderHeight);
		};

		calculateCellHeight();
		window.addEventListener('resize', calculateCellHeight);
		window.addEventListener('orientationchange', calculateCellHeight);

		return () => {
			window.removeEventListener('resize', calculateCellHeight);
			window.removeEventListener('orientationchange', calculateCellHeight);
		};
	}, [startHour, endHour]);

	const goToPreviousDay = () => {
		setIsDateChanging(true);
		setCurrentDate(prev => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() - 1);
			return newDate;
		});
		setTimeout(() => setIsDateChanging(false), 300);
	};

	const goToNextDay = () => {
		setIsDateChanging(true);
		setCurrentDate(prev => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() + 1);
			return newDate;
		});
		setTimeout(() => setIsDateChanging(false), 300);
	};

	const goToToday = () => {
		setIsDateChanging(true);
		setCurrentDate(new Date());
		setTimeout(() => setIsDateChanging(false), 300);
	};

	// スワイプイベント処理
	const handleTouchStart = (e: React.TouchEvent) => {
		setStartX(e.touches[0].clientX);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!startX) return;
		
		const endX = e.changedTouches[0].clientX;
		const diffX = startX - endX;
		
		// スワイプ距離が50px以上の場合のみ反応
		if (Math.abs(diffX) > 50) {
			if (diffX > 0) {
				// 左スワイプ → 翌日
				goToNextDay();
			} else {
				// 右スワイプ → 前日
				goToPreviousDay();
			}
		}
		
		setStartX(null);
	};

	// モック予定データ（開始時間、終了時間、タイトル、メンバー、色）
	const mockEvents = [
		{ startHour: 7, endHour: 8, title: "朝食", member: "father", color: "bg-blue-500" },
		{ startHour: 9, endHour: 11, title: "会議", member: "father", color: "bg-blue-600" },
		{ startHour: 19, endHour: 20, title: "夕食", member: "father", color: "bg-blue-500" },
		
		{ startHour: 10, endHour: 12, title: "買い物", member: "mother", color: "bg-red-500" },
		{ startHour: 15, endHour: 17, title: "習い事", member: "mother", color: "bg-red-600" },
		
		{ startHour: 8, endHour: 15, title: "学校", member: "son1", color: "bg-green-500" },
		{ startHour: 15, endHour: 17, title: "部活", member: "son1", color: "bg-green-600" },
		
		{ startHour: 8, endHour: 14, title: "学校", member: "son2", color: "bg-yellow-500" },
		{ startHour: 16, endHour: 17, title: "習い事", member: "son2", color: "bg-yellow-600" },
	];

	// 特定の時間とメンバーのイベントを取得
	const getEventForHourAndMember = (hour: number, member: string) => {
		return mockEvents.find(event => 
			event.member === member && 
			event.startHour <= hour && 
			hour < event.endHour
		);
	};

	// イベントが開始する時間かどうか
	const isEventStart = (hour: number, member: string) => {
		return mockEvents.some(event => 
			event.member === member && 
			event.startHour === hour
		);
	};

	// 特定の時間で開始するイベントを取得（高さ計算用）
	const getStartingEvents = (hour: number, member: string) => {
		return mockEvents.filter(event => 
			event.member === member && 
			event.startHour === hour
		);
	};

	return (
		<div 
			className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{/* ヘッダー - 固定高さ */}
			<div className="bg-white shadow-sm p-4 flex-shrink-0 relative">
				<div className={`text-center px-6 py-4 rounded-lg transition-all duration-300 ${
					isDateChanging 
						? "bg-green-100 scale-105" 
						: "bg-blue-50"
				}`}>
					<h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
						isDateChanging ? "text-green-800" : "text-blue-800"
					}`}>
						{format(currentDate, "yyyy年M月d日", { locale: ja })} ({format(currentDate, "EEEE", { locale: ja })})
					</h1>
				</div>
				{/* 設定ボタン */}
				<button
					onClick={() => setIsSettingsOpen(true)}
					className="absolute top-4 right-4 w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
				>
					<span className="text-lg">⚙️</span>
				</button>
			</div>

			{/* カレンダーグリッド - 残り画面を使用 */}
			<div className="flex-1 overflow-hidden min-h-0">
				<div className="h-full w-full flex bg-white overflow-auto">
					{/* 時間軸 */}
					<div className="w-20 sm:w-24 bg-blue-50 border-r-2 border-blue-200 flex-shrink-0">
						<div 
							className="font-bold text-center border-b-2 border-blue-200 text-base sm:text-lg bg-blue-100 text-blue-900 flex items-center justify-center"
							style={{ height: `${headerHeight}px` }}
						>
							時間
						</div>
						{Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour).map(hour => (
							<div 
								key={`time-${hour}`} 
								className="border-b border-blue-200 text-center text-base sm:text-lg text-blue-800 flex items-center justify-center font-medium"
								style={{ height: `${cellHeight}px` }}
							>
								{hour}:00
							</div>
						))}
					</div>

					{/* 家族メンバーカラム */}
					{[
						{ member: "father", name: "お父さん", bgColor: "bg-blue-100" },
						{ member: "mother", name: "お母さん", bgColor: "bg-red-100" },
						{ member: "son1", name: "長男", bgColor: "bg-green-100" },
						{ member: "son2", name: "次男", bgColor: "bg-yellow-100" }
					].map(({ member, name, bgColor }) => (
						<div key={member} className="flex-1 min-w-0 border-r border-blue-200 relative">
							{/* ヘッダー */}
							<div 
								className={`${bgColor} font-bold text-center border-b-2 border-blue-200 text-base sm:text-lg text-gray-800 flex items-center justify-center`}
								style={{ height: `${headerHeight}px` }}
							>
								{name}
							</div>

							{/* 時間スロットの背景 */}
							{Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour).map(hour => (
								<div 
									key={`bg-${member}-${hour}`} 
									className="border-b border-blue-200" 
									style={{ height: `${cellHeight}px` }}
								/>
							))}

							{/* イベント表示（絶対位置） */}
							{mockEvents
								.filter(event => event.member === member)
								.map((event, index) => {
									const eventStartHour = event.startHour;
									const duration = event.endHour - event.startHour;
									const topPosition = (eventStartHour - startHour) * cellHeight + headerHeight;
									const height = duration * cellHeight;

									return (
										<div
											key={`event-${member}-${index}`}
											className={`absolute left-1 right-1 ${event.color} text-white rounded text-sm sm:text-base lg:text-lg px-2 sm:px-3 py-1 sm:py-2 shadow-sm z-10 overflow-hidden`}
											style={{
												top: `${topPosition}px`,
												height: `${height}px`,
												minHeight: `${Math.max(20, cellHeight * 0.8)}px`
											}}
										>
											<div className="font-semibold leading-tight truncate">
												{event.title}
											</div>
											<div className="text-xs sm:text-sm lg:text-base opacity-90 leading-tight">
												{eventStartHour}:00-{event.endHour}:00
											</div>
										</div>
									);
								})}
						</div>
					))}
				</div>
			</div>

			{/* フローティング今日ボタン */}
			<button
				onClick={goToToday}
				className="fixed bottom-6 right-6 w-14 h-14 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-2xl z-50 transition-all"
			>
				📅
			</button>

			{/* フローティングローダー */}
			{isDateChanging && (
				<div className="fixed bottom-6 left-6 bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg z-50">
					<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}

			{/* 設定モーダル */}
			{isSettingsOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsSettingsOpen(false)}>
					<div className="bg-white rounded-lg p-6 w-80 max-w-md" onClick={(e) => e.stopPropagation()}>
						<h2 className="text-xl font-bold mb-4 text-center">表示設定</h2>
						
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									開始時間: {startHour}:00
								</label>
								<input
									type="range"
									min="0"
									max="23"
									value={startHour}
									onChange={(e) => setStartHour(Number(e.target.value))}
									className="w-full"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									終了時間: {endHour}:00
								</label>
								<input
									type="range"
									min="0"
									max="23"
									value={endHour}
									onChange={(e) => setEndHour(Number(e.target.value))}
									className="w-full"
								/>
							</div>

							<div className="text-sm text-gray-600 text-center">
								表示時間: {endHour - startHour + 1}時間
							</div>
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
			)}

		</div>
	);
};