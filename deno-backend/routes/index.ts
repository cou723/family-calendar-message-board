import { addSecurityHeaders } from "../lib/utils.ts";
import {
	handleAuthStatus,
	handleCallback,
	handleLogin,
	handleLogout,
} from "./auth.ts";
import { handleCalendarEvents, handleCalendarList } from "./calendar.ts";

export async function handleRequest(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const { pathname, method } = new URL(request.url);

	// CORS設定
	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Allow-Credentials": "true",
	};

	// プリフライトリクエストの処理
	if (method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	}

	let response: Response;

	try {
		// ルーティング
		if (pathname === "/api/auth/login" && method === "GET") {
			response = await handleLogin(request);
		} else if (pathname === "/api/auth/callback" && method === "GET") {
			response = await handleCallback(request);
		} else if (pathname === "/api/auth/logout" && method === "POST") {
			response = await handleLogout(request);
		} else if (pathname === "/api/auth/status" && method === "GET") {
			response = await handleAuthStatus(request);
		} else if (pathname === "/api/calendar/events" && method === "GET") {
			response = await handleCalendarEvents(request);
		} else if (pathname === "/api/calendar/list" && method === "GET") {
			response = await handleCalendarList(request);
		} else if (pathname === "/health" && method === "GET") {
			response = new Response(
				JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
				{
					headers: { "Content-Type": "application/json" },
				},
			);
		} else {
			response = new Response("Not Found", { status: 404 });
		}
	} catch (error) {
		console.error("Request handling error:", error);
		response = new Response("Internal Server Error", { status: 500 });
	}

	// セキュリティヘッダーとCORSヘッダーを追加
	Object.entries(corsHeaders).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	return addSecurityHeaders(response);
}
