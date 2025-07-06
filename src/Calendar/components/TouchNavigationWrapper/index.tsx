import { Stack } from "@mantine/core";
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
		<Stack
			gap={0}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			style={{
				height: "100vh",
				width: "100vw",
				backgroundColor: "#f3f4f6", // gray-100
				overflow: "hidden",
			}}
		>
			{children}
		</Stack>
	);
};
