import type { CalendarEvent, FamilyMember } from "../shared/types";

export interface ICalendarDataProvider {
	/**
	 * 指定した日付の家族全員のカレンダーイベントを取得
	 */
	getCalendarEvents(
		date: Date,
		familyMembers: FamilyMember[],
	): Promise<CalendarEvent[]>;

	/**
	 * 利用可能なカレンダーの一覧を取得
	 */
	getAvailableCalendars(): Promise<
		{ id: string; name: string; color?: string }[]
	>;
}
