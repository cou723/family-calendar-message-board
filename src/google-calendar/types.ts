// Google Calendar API SDKの型を参照
/// <reference types="gapi" />
/// <reference types="gapi.client.calendar-v3" />

// Google Calendar API SDKの型を再エクスポート
export type CalendarEvent = gapi.client.calendar.Event;
export type CalendarEventList = gapi.client.calendar.Events;
export type Calendar = gapi.client.calendar.Calendar;
export type CalendarList = gapi.client.calendar.CalendarList;

// アプリケーション固有の型定義
export interface FamilyMember {
	id: string;
	name: string;
	calendarId: string;
	color: string;
}

export interface CalendarConfig {
	apiKey: string;
	clientId: string;
	scope: string;
	discoveryDocs: string[];
}

export interface DateRange {
	start: Date;
	end: Date;
}

export interface ProcessedEvent {
	id: string;
	title: string;
	startTime: Date;
	endTime: Date;
	isAllDay: boolean;
	memberId: string;
	color: string;
}

export type CalendarError =
	| { type: "GOOGLE_API_ERROR"; message: string; code: number }
	| { type: "NETWORK_ERROR"; message: string }
	| { type: "PERMISSION_ERROR"; requiredScope: string }
	| { type: "INITIALIZATION_ERROR"; message: string };

export interface CalendarDataFetcher {
	fetchEvents: (
		calendarId: string,
		dateRange: DateRange,
	) => Promise<CalendarEvent[]>;
	getCurrentDate: () => Date;
}