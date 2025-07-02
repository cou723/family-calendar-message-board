import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const SimpleCalendarTest = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [startX, setStartX] = useState<number | null>(null);
	const [isDateChanging, setIsDateChanging] = useState(false);

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
		setCurrentDate(new Date());
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
			className="h-screen bg-gray-100 flex flex-col"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{/* ヘッダー - 固定高さ */}
			<div className="bg-white shadow-sm p-3 flex-shrink-0">
				<div className="flex items-center justify-between">
					<button
						onClick={goToPreviousDay}
						className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg"
					>
						← 前日
					</button>
					
					<div className={`text-center px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
						isDateChanging 
							? "bg-green-100 border-green-300 scale-105" 
							: "bg-blue-50 border-blue-200"
					}`}>
						<h1 className={`text-2xl font-bold ${
							isDateChanging ? "text-green-800" : "text-blue-800"
						}`}>
							{format(currentDate, "yyyy年M月d日", { locale: ja })}
						</h1>
						<p className={`text-lg font-semibold ${
							isDateChanging ? "text-green-600" : "text-blue-600"
						}`}>
							({format(currentDate, "EEEE", { locale: ja })})
						</p>
						{isDateChanging && (
							<p className="text-sm text-green-700 mt-1">
								📅 日付変更中...
							</p>
						)}
					</div>

					<button
						onClick={goToNextDay}
						className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg"
					>
						翌日 →
					</button>
				</div>
				
				<div className="text-center mt-2">
					<button
						onClick={goToToday}
						className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
					>
						今日
					</button>
					<span className="ml-4 text-sm text-gray-600">
						← 左右にスワイプで日付変更 →
					</span>
				</div>
			</div>

			{/* カレンダーグリッド - 残り画面を使用 */}
			<div className="flex-1 overflow-hidden">
				<div className="h-full flex bg-white">
					{/* 時間軸 */}
					<div className="w-20 bg-gray-50 border-r-2 border-gray-300">
						<div className="font-bold text-center py-2 border-b-2 border-gray-200 text-sm bg-gray-100">
							時間
						</div>
						{Array.from({ length: 18 }, (_, i) => i + 6).map(hour => (
							<div key={`time-${hour}`} className="h-8 border-b border-gray-200 text-center text-xs py-1 flex items-center justify-center font-medium">
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
						<div key={member} className="flex-1 border-r border-gray-200 relative">
							{/* ヘッダー */}
							<div className={`${bgColor} font-bold text-center py-2 border-b-2 border-gray-200 text-sm`}>
								{name}
							</div>

							{/* 時間スロットの背景 */}
							{Array.from({ length: 18 }, (_, i) => i + 6).map(hour => (
								<div key={`bg-${member}-${hour}`} className="h-8 border-b border-gray-200" />
							))}

							{/* イベント表示（絶対位置） */}
							{mockEvents
								.filter(event => event.member === member)
								.map((event, index) => {
									const startHour = event.startHour;
									const duration = event.endHour - event.startHour;
									const topPosition = (startHour - 6) * 32 + 32; // ヘッダー分の32px追加
									const height = duration * 32; // 1時間=32px

									return (
										<div
											key={`event-${member}-${index}`}
											className={`absolute left-1 right-1 ${event.color} text-white rounded text-xs px-2 py-1 shadow-sm z-10`}
											style={{
												top: `${topPosition}px`,
												height: `${height}px`,
												minHeight: '24px'
											}}
										>
											<div className="font-semibold leading-tight">
												{event.title}
											</div>
											<div className="text-xs opacity-90 leading-tight">
												{startHour}:00-{event.endHour}:00
											</div>
										</div>
									);
								})}
						</div>
					))}
				</div>
			</div>

			{/* フッター - 固定高さ */}
			<div className="bg-white p-2 flex-shrink-0 border-t border-gray-200">
				<div className="text-center text-gray-600 text-sm">
					🧪 家族カレンダー - 6:00〜23:00 | スワイプで日付変更
				</div>
			</div>
		</div>
	);
};