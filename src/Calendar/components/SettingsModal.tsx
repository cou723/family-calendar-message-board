import { useFamilyCalendars } from "../data/useFamilyCalendars";
import { SettingsModal as SettingsModalBase } from "../settings/SettingsModal";
import { useSettings } from "../shared/useSettings";

export const SettingsModal = () => {
	const { timeRange, settingsModal, settingsControl } = useSettings();
	const { familyCalendars, updateFamilyCalendars } = useFamilyCalendars();

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
