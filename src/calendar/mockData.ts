export interface MockEvent {
	id?: string;
	startHour: number;
	endHour: number;
	title: string;
	member: string;
	color: string;
	description?: string;
	location?: string;
}

// モック予定データ（開始時間、終了時間、タイトル、メンバー、色）
export const mockEvents: MockEvent[] = [
	{
		id: "mock-1",
		startHour: 7,
		endHour: 8,
		title: "朝食",
		member: "father",
		color: "bg-blue-500",
	},
	{
		id: "mock-2",
		startHour: 9.5,
		endHour: 11,
		title: "会議",
		member: "father",
		color: "bg-blue-600",
	},
	{
		id: "mock-3",
		startHour: 13.5,
		endHour: 14.5,
		title: "商談",
		member: "father",
		color: "bg-blue-700",
	},
	{
		id: "mock-4",
		startHour: 19,
		endHour: 20,
		title: "夕食",
		member: "father",
		color: "bg-blue-500",
	},

	{
		id: "mock-5",
		startHour: 10.5,
		endHour: 12,
		title: "買い物",
		member: "mother",
		color: "bg-red-500",
	},
	{
		id: "mock-6",
		startHour: 14.5,
		endHour: 15.5,
		title: "美容院",
		member: "mother",
		color: "bg-red-700",
	},
	{
		id: "mock-7",
		startHour: 15,
		endHour: 17,
		title: "習い事",
		member: "mother",
		color: "bg-red-600",
	},

	{
		id: "mock-8",
		startHour: 8,
		endHour: 15,
		title: "学校",
		member: "son1",
		color: "bg-green-500",
	},
	{
		id: "mock-9",
		startHour: 15.5,
		endHour: 17,
		title: "部活",
		member: "son1",
		color: "bg-green-600",
	},
	{
		id: "mock-10",
		startHour: 19.5,
		endHour: 21,
		title: "塾",
		member: "son1",
		color: "bg-green-700",
	},

	{
		id: "mock-11",
		startHour: 8,
		endHour: 14,
		title: "学校",
		member: "son2",
		color: "bg-yellow-500",
	},
	{
		id: "mock-12",
		startHour: 16.5,
		endHour: 17.5,
		title: "習い事",
		member: "son2",
		color: "bg-yellow-600",
	},
	{
		id: "mock-13",
		startHour: 20.5,
		endHour: 21.5,
		title: "ゲーム時間",
		member: "son2",
		color: "bg-yellow-700",
	},
];

// 特定の時間とメンバーのイベントを取得
export const getEventForHourAndMember = (hour: number, member: string) => {
	return mockEvents.find(
		(event) =>
			event.member === member &&
			event.startHour <= hour &&
			hour < event.endHour,
	);
};

// イベントが開始する時間かどうか
export const isEventStart = (hour: number, member: string) => {
	return mockEvents.some(
		(event) => event.member === member && event.startHour === hour,
	);
};

// 特定の時間で開始するイベントを取得（高さ計算用）
export const getStartingEvents = (hour: number, member: string) => {
	return mockEvents.filter(
		(event) => event.member === member && event.startHour === hour,
	);
};
