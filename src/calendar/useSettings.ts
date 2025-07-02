import { useState } from "react";

export const useSettings = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [startHour, setStartHour] = useState(6);
  const [endHour, setEndHour] = useState(23);

  return {
    timeRange: {
      startHour,
      endHour,
    },
    settingsModal: {
      isOpen: isSettingsOpen,
      setIsOpen: setIsSettingsOpen,
    },
    settingsControl: {
      setStartHour,
      setEndHour,
    },
  };
};