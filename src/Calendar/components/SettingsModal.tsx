import { SettingsModal as SettingsModalBase } from "../settings/SettingsModal";
import { useDateNavigation } from "../shared/useDateNavigation";
import { useGoogleCalendar } from "../shared/useGoogleCalendar";
import { useSettings } from "../shared/useSettings";

export const SettingsModal = () => {
	const { timeRange, settingsModal, settingsControl } = useSettings();
	const { currentDate } = useDateNavigation();
	const { familyCalendars, updateFamilyCalendars } = useGoogleCalendar(
		currentDate.date,
	);

	return (
		<SettingsModalBase
			isSettingsOpen={settingsModal.isOpen}
			setIsSettingsOpen={settingsModal.setIsOpen}
			startHour={timeRange.startHour}
			setStartHour={settingsControl.setStartHour}
			endHour={timeRange.endHour}
			setEndHour={settingsControl.setEndHour}
			familyCalendars={familyCalendars}
			onUpdateCalendars={updateFamilyCalendars}
		/>
	);
};
