import { useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { type InferOutput, number, object, parse } from "valibot";
import { useFamilyCalendars } from "../data/useFamilyCalendars";
import { SafeStorage, safeJsonParse, safeSync } from "../shared/safeStorage";
import type { FamilyCalendarConfig } from "../shared/types";

interface SettingsContextType {
	timeRange: {
		startHour: number;
		endHour: number;
	};
	settingsControl: {
		setStartHour: (hour: number) => void;
		setEndHour: (hour: number) => void;
		setTimeRange: (range: [number, number]) => void;
	};
	familyCalendars: FamilyCalendarConfig[];
	setFamilyCalendars: (calendars: FamilyCalendarConfig[]) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
	children: ReactNode;
}

// 時間範囲設定のスキーマ
const TimeRangeSchema = object({
	startHour: number(),
	endHour: number(),
});

type TimeRangeConfig = InferOutput<typeof TimeRangeSchema>;

// デフォルト時間範囲設定
const getDefaultTimeRange = (): TimeRangeConfig => ({
	startHour: 6,
	endHour: 23,
});

// ローカルストレージから時間範囲設定を読み込み
const loadTimeRangeFromStorage = (): TimeRangeConfig => {
	const result = SafeStorage.getItem("timeRangeSettings");

	if (!result.success) {
		console.error("時間範囲設定の読み込みエラー:", result.error);
		console.warn("デフォルト時間範囲設定を使用します");
		return getDefaultTimeRange();
	}

	if (!result.data) {
		return getDefaultTimeRange();
	}

	const parseResult = safeJsonParse(result.data);
	if (!parseResult.success) {
		console.error("時間範囲設定のJSON解析エラー:", parseResult.error);
		console.warn("デフォルト時間範囲設定を使用します");
		return getDefaultTimeRange();
	}

	const validationResult = safeSync(
		() => parse(TimeRangeSchema, parseResult.data),
		"時間範囲設定のバリデーションに失敗しました",
	);

	if (!validationResult.success) {
		console.error(
			"時間範囲設定のバリデーションエラー:",
			validationResult.error,
		);
		console.warn("デフォルト時間範囲設定を使用します");
		return getDefaultTimeRange();
	}

	return validationResult.data;
};

// ローカルストレージに時間範囲設定を保存
const saveTimeRangeToStorage = (timeRange: TimeRangeConfig) => {
	const result = SafeStorage.setItem(
		"timeRangeSettings",
		JSON.stringify(timeRange),
	);
	if (!result.success) {
		console.error("時間範囲設定の保存エラー:", result.error);
	}
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
	const [startHour, setStartHour] = useState(6);
	const [endHour, setEndHour] = useState(23);
	const queryClient = useQueryClient();

	// 初期化時にローカルストレージから時間範囲設定を読み込み
	useEffect(() => {
		const timeRange = loadTimeRangeFromStorage();
		setStartHour(timeRange.startHour);
		setEndHour(timeRange.endHour);
	}, []);

	// useFamilyCalendarsを使用してLocalStorageと同期
	const { familyCalendars, updateFamilyCalendars } = useFamilyCalendars();

	const setTimeRange = (range: [number, number]) => {
		setStartHour(range[0]);
		setEndHour(range[1]);

		// ローカルストレージに保存
		saveTimeRangeToStorage({
			startHour: range[0],
			endHour: range[1],
		});

		// 時間設定変更時にキャッシュを無効化
		queryClient.invalidateQueries({
			queryKey: ["calendarEvents"],
		});
	};

	const setStartHourWithCache = (hour: number) => {
		setStartHour(hour);
		// ローカルストレージに保存
		saveTimeRangeToStorage({
			startHour: hour,
			endHour,
		});
		// 時間設定変更時にキャッシュを無効化
		queryClient.invalidateQueries({
			queryKey: ["calendarEvents"],
		});
	};

	const setEndHourWithCache = (hour: number) => {
		setEndHour(hour);
		// ローカルストレージに保存
		saveTimeRangeToStorage({
			startHour,
			endHour: hour,
		});
		// 時間設定変更時にキャッシュを無効化
		queryClient.invalidateQueries({
			queryKey: ["calendarEvents"],
		});
	};

	const value: SettingsContextType = {
		timeRange: {
			startHour,
			endHour,
		},
		settingsControl: {
			setStartHour: setStartHourWithCache,
			setEndHour: setEndHourWithCache,
			setTimeRange,
		},
		familyCalendars,
		setFamilyCalendars: updateFamilyCalendars,
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
