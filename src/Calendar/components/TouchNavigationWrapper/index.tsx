import type { ReactNode } from "react";
import { useDateNavigation } from "../../shared/useDateNavigation";
import { useSwipeState } from "./useSwipeState";
import { useTouchNavigation } from "./useTouchNavigation";

interface TouchNavigationWrapperProps {
	children: ReactNode;
}

export const TouchNavigationWrapper = ({
	children,
}: TouchNavigationWrapperProps) => {
	const { actions } = useDateNavigation();
	const { swipe } = useSwipeState();
	const { handleTouchStart, handleTouchEnd } = useTouchNavigation({
		startX: swipe.startX,
		setStartX: swipe.setStartX,
		goToNextDay: actions.goToNextDay,
		goToPreviousDay: actions.goToPreviousDay,
	});

	return (
		<div
			className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{children}
		</div>
	);
};
