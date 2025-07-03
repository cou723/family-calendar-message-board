import type { CalendarConfig } from "./types";

// Google Calendar API設定
export const GOOGLE_CALENDAR_CONFIG: CalendarConfig = {
	apiKey: import.meta.env.VITE_GOOGLE_API_KEY || "",
	clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
	scope: "https://www.googleapis.com/auth/calendar.readonly",
	discoveryDocs: [
		"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
	],
};

// 家族メンバー設定（設定ファイルまたは環境変数から読み込み）
export const FAMILY_MEMBERS = [
	{
		id: "member1",
		name: "お父さん",
		calendarId: import.meta.env.VITE_CALENDAR_ID_FATHER || "father@example.com",
		color: "#4285f4", // Google Blue
	},
	{
		id: "member2",
		name: "お母さん",
		calendarId: import.meta.env.VITE_CALENDAR_ID_MOTHER || "mother@example.com",
		color: "#ea4335", // Google Red
	},
	{
		id: "member3",
		name: "長男",
		calendarId: import.meta.env.VITE_CALENDAR_ID_SON1 || "son1@example.com",
		color: "#34a853", // Google Green
	},
	{
		id: "member4",
		name: "次男",
		calendarId: import.meta.env.VITE_CALENDAR_ID_SON2 || "son2@example.com",
		color: "#fbbc04", // Google Yellow
	},
] as const;
