import { useState } from "react";
import type { FamilyCalendarConfig } from "../shared/types";

const getDefaultFamilyCalendars = (): FamilyCalendarConfig[] => [
	{
		member: "father",
		calendarIds: ["primary"],
		name: "お父さん",
		bgColor: "bg-blue-100",
	},
	{
		member: "mother",
		calendarIds: ["primary"],
		name: "お母さん",
		bgColor: "bg-red-100",
	},
	{
		member: "son1",
		calendarIds: ["primary"],
		name: "長男",
		bgColor: "bg-green-100",
	},
	{
		member: "son2",
		calendarIds: ["primary"],
		name: "次男",
		bgColor: "bg-yellow-100",
	},
];

const loadFamilyCalendarsFromStorage = (): FamilyCalendarConfig[] => {
	try {
		const saved = localStorage.getItem("familyCalendarSettings");
		if (saved) {
			const parsed = JSON.parse(saved);
			// 旧形式（calendarId）から新形式（calendarIds）への移行
			return parsed.map((config: FamilyCalendarConfig) => {
				if ("calendarId" in config && !config.calendarIds) {
					return {
						...config,
						calendarIds: [
							(config as unknown as { calendarId: string }).calendarId,
						],
					};
				}
				return config;
			});
		}
	} catch (error) {
		console.error("ローカルストレージからの設定読み込みエラー:", error);
	}

	return getDefaultFamilyCalendars();
};

export const useFamilyCalendars = () => {
	const [familyCalendars, setFamilyCalendars] = useState<
		FamilyCalendarConfig[]
	>(loadFamilyCalendarsFromStorage);

	/**
	 * 家族カレンダー設定を更新
	 */
	const updateFamilyCalendars = (
		newCalendars: FamilyCalendarConfig[],
	): void => {
		setFamilyCalendars(newCalendars);
		try {
			localStorage.setItem(
				"familyCalendarSettings",
				JSON.stringify(newCalendars),
			);
		} catch (error) {
			console.error("ローカルストレージへの設定保存エラー:", error);
		}
	};

	return {
		familyCalendars,
		updateFamilyCalendars,
	};
};
