import { refreshAccessToken } from "../lib/google-auth.ts";
import { getSession, updateSession } from "../lib/session.ts";
import { getSessionIdFromCookie } from "../lib/utils.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";

async function ensureValidToken(sessionId: string): Promise<string | null> {
	const session = await getSession(sessionId);

	if (!session?.authenticated || !session.accessToken) {
		return null;
	}

	// トークン期限チェック・自動更新
	if (session.expiresAt && session.expiresAt <= Date.now() + 5 * 60 * 1000) {
		// 5分前に更新
		if (session.refreshToken) {
			try {
				const newTokens = await refreshAccessToken(
					session.refreshToken,
					GOOGLE_CLIENT_ID,
					GOOGLE_CLIENT_SECRET,
				);
				await updateSession(sessionId, {
					accessToken: newTokens.access_token,
					expiresAt: Date.now() + newTokens.expires_in * 1000,
				});
				return newTokens.access_token;
			} catch (error) {
				console.error("Token refresh error:", error);
				return null;
			}
		} else {
			return null;
		}
	}

	return session.accessToken;
}

export async function handleCalendarEvents(
	request: Request,
): Promise<Response> {
	const sessionId = getSessionIdFromCookie(request);
	if (!sessionId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const accessToken = await ensureValidToken(sessionId);
	if (!accessToken) {
		return new Response("Unauthorized", { status: 401 });
	}

	const url = new URL(request.url);
	const calendarId = url.searchParams.get("calendarId");
	const timeMin = url.searchParams.get("timeMin");
	const timeMax = url.searchParams.get("timeMax");

	if (!calendarId) {
		return new Response("Missing calendarId parameter", { status: 400 });
	}

	try {
		const apiUrl = new URL(
			`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
		);

		if (timeMin) apiUrl.searchParams.set("timeMin", timeMin);
		if (timeMax) apiUrl.searchParams.set("timeMax", timeMax);
		apiUrl.searchParams.set("singleEvents", "true");
		apiUrl.searchParams.set("orderBy", "startTime");

		const calendarResponse = await fetch(apiUrl.toString(), {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!calendarResponse.ok) {
			const error = await calendarResponse.text();
			console.error("Google Calendar API error:", error);
			return new Response("Calendar API error", { status: 500 });
		}

		const data = await calendarResponse.json();
		return new Response(JSON.stringify(data), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Calendar request error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}

export async function handleCalendarList(request: Request): Promise<Response> {
	const sessionId = getSessionIdFromCookie(request);
	if (!sessionId) {
		return new Response("Unauthorized", { status: 401 });
	}

	const accessToken = await ensureValidToken(sessionId);
	if (!accessToken) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const calendarResponse = await fetch(
			"https://www.googleapis.com/calendar/v3/users/me/calendarList",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!calendarResponse.ok) {
			const error = await calendarResponse.text();
			console.error("Google Calendar API error:", error);
			return new Response("Calendar API error", { status: 500 });
		}

		const data = await calendarResponse.json();
		return new Response(JSON.stringify(data), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Calendar list request error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}
