import { createContext, type ReactNode, useContext, useState } from "react";

interface SettingsContextType {
	timeRange: {
		startHour: number;
		endHour: number;
	};
	settingsModal: {
		isOpen: boolean;
		setIsOpen: (isOpen: boolean) => void;
	};
	settingsControl: {
		setStartHour: (hour: number) => void;
		setEndHour: (hour: number) => void;
	};
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
	children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
	const [startHour, setStartHour] = useState(6);
	const [endHour, setEndHour] = useState(23);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

	const value: SettingsContextType = {
		timeRange: {
			startHour,
			endHour,
		},
		settingsModal: {
			isOpen: isSettingsModalOpen,
			setIsOpen: setIsSettingsModalOpen,
		},
		settingsControl: {
			setStartHour,
			setEndHour,
		},
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
