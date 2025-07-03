import { getGapiCalendarClient } from "./gapiAuth";
import type { CalendarEvent } from "./types";

/**
 * Google Calendar APIからイベントを取得する（gapi版）
 */
export const fetchGapiCalendarEvents = async (
	calendarId: string,
	date: Date,
	member?: string,
): Promise<CalendarEvent[]> => {
	try {
		const calendar = getGapiCalendarClient();

		// 指定日の開始と終了時刻を設定
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		// Google Calendar APIでイベントを取得
		const response = await calendar.events.list({
			calendarId,
			timeMin: startOfDay.toISOString(),
			timeMax: endOfDay.toISOString(),
			singleEvents: true,
			orderBy: "startTime",
		});

		const events = response.result.items || [];

		// CalendarEvent型に変換
		return events.map((event: any) =>
			convertGoogleEventToCalendarEvent(event, member || "", calendarId),
		);
	} catch (error) {
		console.error(`カレンダー ${calendarId} のイベント取得エラー:`, error);
		throw new Error(`カレンダーイベントの取得に失敗しました: ${error}`);
	}
};

/**
 * 複数のカレンダーからイベントを取得する（gapi版）
 */
export const fetchGapiMultipleCalendarEvents = async (
	calendarConfigs: { calendarId: string; member: string }[],
	date: Date,
): Promise<CalendarEvent[]> => {
	try {
		const eventPromises = calendarConfigs.map(async (config) => {
			const events = await fetchGapiCalendarEvents(
				config.calendarId,
				date,
				config.member,
			);
			// メンバー情報はすでに設定済み
			return events;
		});

		const allEvents = await Promise.all(eventPromises);
		return allEvents.flat();
	} catch (error) {
		console.error("複数カレンダーのイベント取得エラー:", error);
		throw error;
	}
};

/**
 * Google Calendar APIのイベントオブジェクトをCalendarEvent型に変換
 */
function convertGoogleEventToCalendarEvent(
	googleEvent: any,
	member: string,
	calendarId: string, // 将来的にカレンダー別色分けで使用予定
): CalendarEvent {
	const { summary, start, end, description, location } = googleEvent;

	// 開始時刻と終了時刻を解析
	const startTime = parseGoogleDateTime(start);
	const endTime = parseGoogleDateTime(end);

	const eventColor = getEventColor(member);

	// デバッグ用ログ
	console.log(
		`イベント変換: member=${member}, color=${eventColor}, title=${summary}, calendarId=${calendarId}`,
	);

	return {
		id: googleEvent.id || "",
		title: summary || "(タイトルなし)",
		startHour: startTime.hour + (startTime.minute >= 30 ? 0.5 : 0),
		endHour: endTime.hour + (endTime.minute >= 30 ? 0.5 : 0),
		member,
		color: eventColor,
		description: description || "",
		location: location || "",
	};
}

/**
 * Google Calendar APIの日時オブジェクトを解析
 */
function parseGoogleDateTime(dateTime: any): { hour: number; minute: number } {
	let date: Date;

	if (dateTime.dateTime) {
		// 時刻指定のイベント
		date = new Date(dateTime.dateTime);
	} else if (dateTime.date) {
		// 終日イベント
		date = new Date(dateTime.date);
		return { hour: 0, minute: 0 }; // 終日イベントは0時として扱う
	} else {
		throw new Error("無効な日時形式です");
	}

	return {
		hour: date.getHours(),
		minute: date.getMinutes(),
	};
}

/**
 * メンバーに応じたイベントの色を取得
 */
function getEventColor(member: string): string {
	const colorMap: Record<string, string> = {
		father: "bg-blue-500",
		mother: "bg-red-500",
		son1: "bg-green-500",
		son2: "bg-yellow-500",
	};

	return colorMap[member] || "bg-gray-500";
}
