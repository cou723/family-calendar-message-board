import { createContext, type ReactNode, useContext, useState } from "react";
import { useFamilyCalendars } from "../data/useFamilyCalendars";
import type { FamilyCalendarConfig } from "../shared/types";

interface SettingsContextType {
	timeRange: {
		startHour: number;
		endHour: number;
	};
	settingsControl: {
		setStartHour: (hour: number) => void;
		setEndHour: (hour: number) => void;
		setTimeRange: (range: [number, number]) => void;
	};
	familyCalendars: FamilyCalendarConfig[];
	setFamilyCalendars: (calendars: FamilyCalendarConfig[]) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
	children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
	const [startHour, setStartHour] = useState(6);
	const [endHour, setEndHour] = useState(23);

	// useFamilyCalendarsを使用してLocalStorageと同期
	const { familyCalendars, updateFamilyCalendars } = useFamilyCalendars();

	const setTimeRange = (range: [number, number]) => {
		setStartHour(range[0]);
		setEndHour(range[1]);
	};

	const value: SettingsContextType = {
		timeRange: {
			startHour,
			endHour,
		},
		settingsControl: {
			setStartHour,
			setEndHour,
			setTimeRange,
		},
		familyCalendars,
		setFamilyCalendars: updateFamilyCalendars,
	};

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = (): SettingsContextType => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
