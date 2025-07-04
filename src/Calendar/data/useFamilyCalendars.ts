import { useState } from "react";
import { array, object, parse, string } from "valibot";
import { SafeStorage, safeJsonParse, safeSync } from "../shared/safeStorage";
import type { FamilyCalendarConfig } from "../shared/types";

// Valibotスキーマでバリデーション
const FamilyCalendarConfigSchema = object({
	member: string(),
	calendarIds: array(string()),
	name: string(),
	color: string(),
});

const FamilyCalendarConfigArraySchema = array(FamilyCalendarConfigSchema);

const getDefaultFamilyCalendars = (): FamilyCalendarConfig[] => [
	{
		member: "father",
		calendarIds: ["primary"],
		name: "お父さん",
		color: "bg-blue-100",
	},
	{
		member: "mother",
		calendarIds: ["primary"],
		name: "お母さん",
		color: "bg-red-100",
	},
	{
		member: "son1",
		calendarIds: ["primary"],
		name: "長男",
		color: "bg-green-100",
	},
	{
		member: "son2",
		calendarIds: ["primary"],
		name: "次男",
		color: "bg-yellow-100",
	},
];

const loadFamilyCalendarsFromStorage = (): FamilyCalendarConfig[] => {
	const result = SafeStorage.getItem("familyCalendarSettings");

	if (!result.success) {
		console.error("ローカルストレージ読み込みエラー:", result.error);
		console.warn("デフォルト設定を使用します");
		return getDefaultFamilyCalendars();
	}

	if (!result.data) {
		// データが存在しない場合
		return getDefaultFamilyCalendars();
	}

	const parseResult = safeJsonParse(result.data);
	if (!parseResult.success) {
		console.error("JSON解析エラー:", parseResult.error);
		console.warn("デフォルト設定を使用します");
		return getDefaultFamilyCalendars();
	}

	const validationResult = safeSync(
		() => parse(FamilyCalendarConfigArraySchema, parseResult.data),
		"Valibot validation failed",
	);

	if (!validationResult.success) {
		console.error("設定データのバリデーションエラー:", validationResult.error);
		console.warn("デフォルト設定を使用します");
		return getDefaultFamilyCalendars();
	}

	return validationResult.data;
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

		const result = SafeStorage.setItem(
			"familyCalendarSettings",
			JSON.stringify(newCalendars),
		);

		if (!result.success) {
			console.error("ローカルストレージへの設定保存エラー:", result.error);
		}
	};

	return {
		familyCalendars,
		updateFamilyCalendars,
	};
};
