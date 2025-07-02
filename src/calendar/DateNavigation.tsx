import { Button } from "react-aria-components";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface DateNavigationProps {
	currentDate: Date;
	onPreviousDay: () => void;
	onNextDay: () => void;
	onToday: () => void;
}

export const DateNavigation = ({
	currentDate,
	onPreviousDay,
	onNextDay,
	onToday,
}: DateNavigationProps) => {
	return (
		<div className="flex items-center justify-between p-6 bg-white border-b-2 border-gray-200">
			{/* 前日ボタン */}
			<Button
				onPress={onPreviousDay}
				className="flex items-center justify-center w-16 h-16 text-3xl text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
				aria-label="前日に移動"
			>
				←
			</Button>

			{/* 現在の日付表示 */}
			<div className="flex flex-col items-center">
				<h1 className="text-4xl font-bold text-gray-800 mb-2">
					{format(currentDate, "yyyy年M月d日", { locale: ja })}
				</h1>
				<p className="text-2xl text-gray-600">
					({format(currentDate, "EEEE", { locale: ja })})
				</p>
			</div>

			{/* 翌日ボタン */}
			<Button
				onPress={onNextDay}
				className="flex items-center justify-center w-16 h-16 text-3xl text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
				aria-label="翌日に移動"
			>
				→
			</Button>

			{/* 今日ボタン */}
			<Button
				onPress={onToday}
				className="px-6 py-3 text-xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
			>
				今日
			</Button>
		</div>
	);
};