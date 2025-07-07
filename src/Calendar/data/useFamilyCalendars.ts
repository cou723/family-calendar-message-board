import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppStorage } from "../shared/appStorage";
import type { FamilyCalendarConfig } from "../shared/types";

const getDefaultFamilyCalendars = (): FamilyCalendarConfig[] => [
	{
		id: "father",
		member: "father",
		calendarIds: [],
		name: "お父さん",
		color: "#1d4ed8", // より濃い青
	},
	{
		id: "mother",
		member: "mother",
		calendarIds: [],
		name: "お母さん",
		color: "#dc2626", // より濃い赤
	},
	{
		id: "son1",
		member: "son1",
		calendarIds: [],
		name: "長男",
		color: "#059669", // より濃い緑
	},
	{
		id: "son2",
		member: "son2",
		calendarIds: [],
		name: "次男",
		color: "#d97706", // より濃いオレンジ
	},
];

const loadFamilyCalendarsFromStorage = (): FamilyCalendarConfig[] => {
	const settings = AppStorage.getFamilyCalendarSettings();

	if (!settings) {
		console.warn(
			"家族カレンダー設定が見つかりません。デフォルト設定を使用します",
		);
		return getDefaultFamilyCalendars();
	}

	return settings.familyCalendars;
};

export const useFamilyCalendars = () => {
	const [familyCalendars, setFamilyCalendars] = useState<
		FamilyCalendarConfig[]
	>(() => {
		try {
			return loadFamilyCalendarsFromStorage();
		} catch (error) {
			console.error("家族カレンダー設定の読み込みエラー:", error);
			return getDefaultFamilyCalendars();
		}
	});
	const queryClient = useQueryClient();

	/**
	 * 家族カレンダー設定を更新
	 */
	const updateFamilyCalendars = (
		newCalendars: FamilyCalendarConfig[],
	): void => {
		setFamilyCalendars(newCalendars);

		const success = AppStorage.setFamilyCalendarSettings({
			familyCalendars: newCalendars,
		});

		if (!success) {
			console.error("家族カレンダー設定の保存に失敗しました");
		}

		// 家族カレンダー設定変更時にクエリキャッシュを無効化
		queryClient.invalidateQueries({
			queryKey: ["calendarEvents"],
		});

		// 更なる確実性のためにカレンダーイベントをリフェッチ
		queryClient.refetchQueries({
			queryKey: ["calendarEvents"],
		});
	};

	return {
		familyCalendars,
		updateCalendars: updateFamilyCalendars,
		updateFamilyCalendars,
	};
};
