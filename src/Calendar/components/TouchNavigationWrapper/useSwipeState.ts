import { useState } from "react";

export const useSwipeState = () => {
	const [startX, setStartX] = useState<number | null>(null);

	return {
		swipe: {
			startX,
			setStartX,
		},
	};
};
