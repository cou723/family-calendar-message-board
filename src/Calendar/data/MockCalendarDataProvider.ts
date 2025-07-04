import { format } from "date-fns";
import type { CalendarEvent, FamilyMember } from "../shared/types";
import type { ICalendarDataProvider } from "./ICalendarDataProvider";

export class MockCalendarDataProvider implements ICalendarDataProvider {
	async getCalendarEvents(
		date: Date,
		familyMembers: FamilyMember[],
	): Promise<CalendarEvent[]> {
		// モックデータを生成
		const mockEvents: CalendarEvent[] = [];
		const dateStr = format(date, "yyyy-MM-dd");

		familyMembers.forEach((member, memberIndex) => {
			// 各家族メンバーに対してランダムなイベントを生成
			const eventCount = Math.floor(Math.random() * 4) + 1; // 1-4個のイベント

			for (let i = 0; i < eventCount; i++) {
				const startHour = 8 + Math.floor(Math.random() * 12); // 8-19時の間
				const duration = Math.floor(Math.random() * 3) + 1; // 1-3時間
				const endHour = Math.min(startHour + duration, 23);

				const eventTypes = [
					"会議",
					"打ち合わせ",
					"外出",
					"買い物",
					"運動",
					"習い事",
					"病院",
					"散歩",
					"読書",
					"料理",
					"掃除",
					"休憩",
				];

				const eventType =
					eventTypes[Math.floor(Math.random() * eventTypes.length)];

				mockEvents.push({
					id: `mock-${memberIndex}-${i}-${dateStr}`,
					title: `${eventType}`,
					startTime: `${dateStr}T${startHour.toString().padStart(2, "0")}:00:00`,
					endTime: `${dateStr}T${endHour.toString().padStart(2, "0")}:00:00`,
					startHour,
					endHour,
					member: member.member,
					color: member.color,
					calendarId: `mock-calendar-${memberIndex}`,
				});
			}
		});

		// 開始時間でソート
		mockEvents.sort((a, b) => a.startHour - b.startHour);

		console.log(
			`📊 Generated ${mockEvents.length} mock events for ${format(date, "yyyy-MM-dd")}`,
		);
		return mockEvents;
	}

	async getAvailableCalendars(): Promise<
		{ id: string; name: string; color?: string }[]
	> {
		// モックのカレンダー一覧
		return [
			{ id: "mock-calendar-0", name: "お父さんのカレンダー", color: "#3788d8" },
			{ id: "mock-calendar-1", name: "お母さんのカレンダー", color: "#e91e63" },
			{ id: "mock-calendar-2", name: "長男のカレンダー", color: "#ff9800" },
			{ id: "mock-calendar-3", name: "長女のカレンダー", color: "#9c27b0" },
		];
	}
}
