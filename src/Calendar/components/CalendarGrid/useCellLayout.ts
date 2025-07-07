import { useEffect, useState } from "react";

export const useCellLayout = (startHour: number, endHour: number) => {
	const [cellHeight, setCellHeight] = useState(32);
	const [headerHeight, setHeaderHeight] = useState(48);

	// 画面サイズに応じてセルの高さを動的に計算
	useEffect(() => {
		const calculateCellHeight = () => {
			const screenHeight = window.innerHeight;

			// 固定される部分の高さを正確に計算（余裕を持った値）
			const bottomHeaderHeight = 110; // 日付ヘッダー部分（下部に移動、実測ベース + 余裕）
			const safetyMargin = 10; // 安全マージン
			const reservedHeight = bottomHeaderHeight + safetyMargin;

			const availableHeight = screenHeight - reservedHeight;
			const totalHours = endHour - startHour + 1; // 動的な時間範囲
			const totalRowsIncludingHeader = totalHours + 1; // 時間セル + グリッドヘッダー

			// 利用可能高さを全行数で分割（グリッドヘッダーも含む）
			const averageRowHeight = Math.floor(
				availableHeight / totalRowsIncludingHeader,
			);

			// セル高さとヘッダー高さを計算（最小値保証）
			const finalCellHeight = Math.max(24, averageRowHeight);
			const finalHeaderHeight = Math.max(40, averageRowHeight);

			setCellHeight(finalCellHeight);
			setHeaderHeight(finalHeaderHeight);
		};

		calculateCellHeight();
		window.addEventListener("resize", calculateCellHeight);
		window.addEventListener("orientationchange", calculateCellHeight);

		return () => {
			window.removeEventListener("resize", calculateCellHeight);
			window.removeEventListener("orientationchange", calculateCellHeight);
		};
	}, [startHour, endHour]);

	return {
		cellHeight,
		headerHeight,
	};
};
