import { createContext, type ReactNode, useContext, useState } from "react";

interface DateNavigationContextType {
	currentDate: {
		date: Date;
		isDateChanging: boolean;
	};
	actions: {
		goToPreviousDay: () => void;
		goToNextDay: () => void;
		goToToday: () => void;
	};
}

const DateNavigationContext = createContext<DateNavigationContextType | null>(
	null,
);

interface DateNavigationProviderProps {
	children: ReactNode;
}

export const DateNavigationProvider = ({
	children,
}: DateNavigationProviderProps) => {
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

	const value: DateNavigationContextType = {
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

	return (
		<DateNavigationContext.Provider value={value}>
			{children}
		</DateNavigationContext.Provider>
	);
};

export const useDateNavigation = (): DateNavigationContextType => {
	const context = useContext(DateNavigationContext);
	if (!context) {
		throw new Error(
			"useDateNavigation must be used within a DateNavigationProvider",
		);
	}
	return context;
};
