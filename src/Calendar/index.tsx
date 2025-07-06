import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { TodayButton } from "./components/TodayButton";
import { TouchNavigationWrapper } from "./components/TouchNavigationWrapper";
import { DateNavigationProvider } from "./contexts/DateNavigationContext";
import { SettingsProvider } from "./contexts/SettingsContext";

export const Calendar = () => {
	return (
		<SettingsProvider>
			<DateNavigationProvider>
				<TouchNavigationWrapper>
					<CalendarHeader />
					<CalendarGrid />
					<TodayButton />
				</TouchNavigationWrapper>
			</DateNavigationProvider>
		</SettingsProvider>
	);
};
