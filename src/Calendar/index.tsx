import { AuthStatus } from "./components/AuthStatus";
import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { SettingsModal } from "./components/SettingsModal";
import { TodayButton } from "./components/TodayButton";
import { TouchNavigationWrapper } from "./components/TouchNavigationWrapper";

export const Calendar = () => {
	return (
		<TouchNavigationWrapper>
			<CalendarHeader />
			<CalendarGrid />
			<TodayButton />
			<SettingsModal />
			<AuthStatus />
		</TouchNavigationWrapper>
	);
};
