/**
 * 時間セルの背景色を計算するユーティリティ関数
 */

interface CellBackgroundOptions {
	hour: number;
	isCurrentHour: boolean;
}

/**
 * 時間セルの背景色クラスを取得
 */
export const getCellBackgroundClass = ({
	hour,
	isCurrentHour,
}: CellBackgroundOptions): string => {
	if (isCurrentHour) return "bg-yellow-100";

	if (hour % 3 === 0) return "bg-gray-200";

	if (hour % 2 === 0) return "bg-gray-100";

	return "";
};

/**
 * 時間列の背景色クラスを取得（時間表示用）
 */
export const getTimeColumnBackgroundClass = ({
	hour,
	isCurrentHour,
}: CellBackgroundOptions): string => {
	if (isCurrentHour) {
		return "bg-yellow-200 text-yellow-900 font-bold";
	}

	if (hour % 3 === 0) {
		return "bg-gray-200 text-blue-800";
	}

	if (hour % 2 === 0) {
		return "bg-gray-100 text-blue-800";
	}

	return "text-blue-800";
};
