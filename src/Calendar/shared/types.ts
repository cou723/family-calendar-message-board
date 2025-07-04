// セルレンダリング用データの型定義
export interface CellLayout {
	startHour: number;
	endHour: number;
	cellHeight: number;
	headerHeight: number;
}

// 家族メンバー情報の型定義
export interface FamilyMember {
	member: string;
	name: string;
	color: string;
	calendarId: string;
}

// カレンダーイベントの型定義
export interface CalendarEvent {
	id: string;
	title: string;
	startTime: string;
	endTime: string;
	startHour: number;
	endHour: number;
	member: string;
	color: string;
	calendarId: string;
	description?: string;
	location?: string;
}

// 家族メンバーのカレンダー設定
export interface FamilyCalendarConfig {
	member: string;
	calendarIds: string[]; // 複数のカレンダーID
	name: string;
	color: string; // bgColorからcolorに統一
}

// Google Calendarのカレンダー情報
export interface GoogleCalendarInfo {
	id: string;
	summary: string;
	description?: string;
	primary?: boolean;
	accessRole: string;
	backgroundColor?: string;
}
