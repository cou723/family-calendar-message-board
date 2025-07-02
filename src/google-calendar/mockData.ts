import type { CalendarDataFetcher, ProcessedEvent, DateRange } from "./types";
import { FAMILY_MEMBERS } from "./config";

// モック用の予定データ
const createMockEvent = (
	id: string,
	title: string,
	startHour: number,
	endHour: number,
	memberId: string,
	isAllDay = false,
): ProcessedEvent => {
	const today = new Date();
	const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, 0, 0);
	const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, 0, 0);
	
	const member = FAMILY_MEMBERS.find(m => m.id === memberId);
	
	return {
		id,
		title,
		startTime,
		endTime,
		isAllDay,
		memberId,
		color: member?.color || "#666666",
	};
};

// 各家族メンバーのモック予定
const mockEventsData: ProcessedEvent[] = [
	// お父さんの予定
	createMockEvent("1", "朝のジョギング", 6, 7, "member1"),
	createMockEvent("2", "会議", 9, 11, "member1"),
	createMockEvent("3", "昼食", 12, 13, "member1"),
	createMockEvent("4", "プレゼン準備", 14, 16, "member1"),
	createMockEvent("5", "帰宅", 18, 19, "member1"),

	// お母さんの予定
	createMockEvent("6", "買い物", 8, 10, "member2"),
	createMockEvent("7", "ランチ会", 12, 14, "member2"),
	createMockEvent("8", "習い事", 15, 17, "member2"),
	createMockEvent("9", "夕食準備", 17, 19, "member2"),

	// 長男の予定
	createMockEvent("10", "登校", 7, 8, "member3"),
	createMockEvent("11", "授業", 8, 15, "member3"),
	createMockEvent("12", "部活動", 15, 17, "member3"),
	createMockEvent("13", "塾", 19, 21, "member3"),

	// 次男の予定
	createMockEvent("14", "登校", 7, 8, "member4"),
	createMockEvent("15", "授業", 8, 14, "member4"),
	createMockEvent("16", "習い事", 15, 16, "member4"),
	createMockEvent("17", "宿題", 19, 20, "member4"),
	createMockEvent("18", "家族映画", 20, 22, "member4"),

	// 家族共通の予定
	createMockEvent("19", "家族朝食", 7, 8, "member1"),
	createMockEvent("20", "家族朝食", 7, 8, "member2"),
	createMockEvent("21", "家族夕食", 19, 20, "member1"),
	createMockEvent("22", "家族夕食", 19, 20, "member2"),
];

// 日付ごとのイベント生成（前後の日付用）
const generateEventsForDate = (targetDate: Date): ProcessedEvent[] => {
	return mockEventsData.map(event => ({
		...event,
		id: `${event.id}_${targetDate.getTime()}`,
		startTime: new Date(
			targetDate.getFullYear(),
			targetDate.getMonth(),
			targetDate.getDate(),
			event.startTime.getHours(),
			event.startTime.getMinutes(),
		),
		endTime: new Date(
			targetDate.getFullYear(),
			targetDate.getMonth(),
			targetDate.getDate(),
			event.endTime.getHours(),
			event.endTime.getMinutes(),
		),
	}));
};

// モック用データフェッチャー
export const createMockDataFetcher = (): CalendarDataFetcher => ({
	fetchEvents: async (calendarId: string, dateRange: DateRange) => {
		// 実際のAPIを模擬した遅延
		await new Promise(resolve => setTimeout(resolve, 500));
		
		const targetDate = dateRange.start;
		const allEvents = generateEventsForDate(targetDate);
		
		// calendarIdに基づいてメンバーのイベントをフィルタ
		const member = FAMILY_MEMBERS.find(m => m.calendarId === calendarId);
		if (!member) return [];
		
		return allEvents
			.filter(event => event.memberId === member.id)
			.map(event => ({
				id: event.id,
				summary: event.title,
				start: event.isAllDay 
					? { date: targetDate.toISOString().split('T')[0] }
					: { dateTime: event.startTime.toISOString() },
				end: event.isAllDay
					? { date: targetDate.toISOString().split('T')[0] }
					: { dateTime: event.endTime.toISOString() },
			})) as any; // Google API形式に合わせる
	},
	getCurrentDate: () => new Date(),
});

// モック認証状態
export const mockAuthState = {
	isInitialized: true,
	isSignedIn: true,
	error: null,
	isLoading: false,
};