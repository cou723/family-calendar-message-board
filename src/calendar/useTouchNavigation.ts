import { useCallback } from "react";

interface UseTouchNavigationProps {
	startX: number | null;
	setStartX: (value: number | null) => void;
	goToNextDay: () => void;
	goToPreviousDay: () => void;
}

export const useTouchNavigation = ({
	startX,
	setStartX,
	goToNextDay,
	goToPreviousDay,
}: UseTouchNavigationProps) => {
	// スワイプイベント処理
	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			setStartX(e.touches[0].clientX);
		},
		[setStartX],
	);

	const handleTouchEnd = useCallback(
		(e: React.TouchEvent) => {
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
		},
		[startX, setStartX, goToNextDay, goToPreviousDay],
	);

	return {
		handleTouchStart,
		handleTouchEnd,
	};
};
