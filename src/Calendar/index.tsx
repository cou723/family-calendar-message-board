import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { SettingsModal } from "./components/SettingsModal";
import { TodayButton } from "./components/TodayButton";
import { TouchNavigationWrapper } from "./components/TouchNavigationWrapper";
import { DateNavigationProvider } from "./contexts/DateNavigationContext";
import { SettingsProvider } from "./contexts/SettingsContext";

export const Calendar = () => {
	return (
		<DateNavigationProvider>
			<SettingsProvider>
				<TouchNavigationWrapper>
					<CalendarHeader />
					<CalendarGrid />
					<TodayButton />
					<SettingsModal />
				</TouchNavigationWrapper>
			</SettingsProvider>
		</DateNavigationProvider>
	);
};
