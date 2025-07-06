/**
 * 時間セルの背景色を計算するユーティリティ関数
 */

interface CellBackgroundOptions {
	hour: number;
	isCurrentHour: boolean;
}

interface CellStyles {
	backgroundColor?: string;
	color?: string;
	fontWeight?: string | number;
}

/**
 * 時間セルの背景色スタイルを取得
 */
export const getCellBackgroundStyle = ({
	hour,
	isCurrentHour,
}: CellBackgroundOptions): CellStyles => {
	if (isCurrentHour) return { backgroundColor: "#fef3c7" }; // yellow-100

	if (hour % 3 === 0) return { backgroundColor: "#e5e7eb" }; // gray-200

	if (hour % 2 === 0) return { backgroundColor: "#f3f4f6" }; // gray-100

	return {};
};

/**
 * 時間列の背景色スタイルを取得（時間表示用）
 */
export const getTimeColumnBackgroundStyle = ({
	hour,
	isCurrentHour,
}: CellBackgroundOptions): CellStyles => {
	if (isCurrentHour) {
		return {
			backgroundColor: "#fcd34d", // yellow-200
			color: "#78350f", // yellow-900
			fontWeight: 700,
		};
	}

	if (hour % 3 === 0) {
		return {
			backgroundColor: "#e5e7eb", // gray-200
			color: "#1e40af", // blue-800
		};
	}

	if (hour % 2 === 0) {
		return {
			backgroundColor: "#f3f4f6", // gray-100
			color: "#1e40af", // blue-800
		};
	}

	return { color: "#1e40af" }; // blue-800
};
