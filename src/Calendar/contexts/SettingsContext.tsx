import { createContext, type ReactNode, useContext, useState } from "react";
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
	const [familyCalendars, setFamilyCalendars] = useState<
		FamilyCalendarConfig[]
	>([
		{
			id: "1",
			member: "person1",
			name: "人A",
			color: "#1d4ed8",
			calendarIds: [],
		},
		{
			id: "2",
			member: "person2",
			name: "人B",
			color: "#dc2626",
			calendarIds: [],
		},
		{
			id: "3",
			member: "person3",
			name: "人C",
			color: "#059669",
			calendarIds: [],
		},
		{
			id: "4",
			member: "person4",
			name: "人D",
			color: "#d97706",
			calendarIds: [],
		},
	]);

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
		setFamilyCalendars,
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
