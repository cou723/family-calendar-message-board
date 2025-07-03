import type { CalendarEvent } from "../calendar/types";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface CalendarEventParams {
	timeMin?: string;
	timeMax?: string;
}

export async function fetchCalendarEvents(
	calendarId: string,
	params: CalendarEventParams,
): Promise<CalendarEvent[]> {
	const searchParams = new URLSearchParams({
		calendarId,
		...(params.timeMin && { timeMin: params.timeMin }),
		...(params.timeMax && { timeMax: params.timeMax }),
	});

	const response = await fetch(
		`${API_BASE_URL}/api/calendar/events?${searchParams}`,
		{
			credentials: "include",
		},
	);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		throw new Error(`Calendar API error: ${response.statusText}`);
	}

	const data = await response.json();
	return data.items || [];
}

export async function fetchCalendarList(): Promise<unknown[]> {
	const response = await fetch(`${API_BASE_URL}/api/calendar/list`, {
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		throw new Error(`Calendar list API error: ${response.statusText}`);
	}

	const data = await response.json();
	return data.items || [];
}
