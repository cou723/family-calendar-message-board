import { useState } from "react";

export const useDateNavigation = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isDateChanging, setIsDateChanging] = useState(false);

	const goToPreviousDay = () => {
		setIsDateChanging(true);
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() - 1);
			return newDate;
		});
		setTimeout(() => setIsDateChanging(false), 300);
	};

	const goToNextDay = () => {
		setIsDateChanging(true);
		setCurrentDate((prev) => {
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

	return {
		currentDate: {
			date: currentDate,
			isDateChanging,
		},
		actions: {
			goToPreviousDay,
			goToNextDay,
			goToToday,
		},
	};
};
