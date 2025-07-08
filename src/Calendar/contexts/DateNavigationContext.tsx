import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

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
	const [currentDate, setCurrentDate] = useState(() => new Date());
	const [isDateChanging, setIsDateChanging] = useState(false);

	// 日付が変わったら自動的に当日に更新
	useEffect(() => {
		const checkDateChange = () => {
			const now = new Date();
			const currentDateOnly = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				currentDate.getDate(),
			);
			const nowDateOnly = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
			);

			if (currentDateOnly.getTime() !== nowDateOnly.getTime()) {
				setCurrentDate(now);
			}
		};

		// 15分ごとに日付変更をチェック
		const interval = setInterval(checkDateChange, 15 * 60 * 1000);
		return () => clearInterval(interval);
	}, [currentDate]);

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
