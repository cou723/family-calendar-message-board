import {
	buildGoogleAuthUrl,
	exchangeCodeForTokens,
	refreshAccessToken,
} from "../lib/google-auth.ts";
import {
	createSession,
	deleteSession,
	getSession,
	updateSession,
} from "../lib/session.ts";
import {
	generateCodeChallenge,
	generateCodeVerifier,
	generateSecureRandomString,
	getSessionIdFromCookie,
} from "../lib/utils.ts";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
const BASE_URL = Deno.env.get("BASE_URL") || "http://localhost:8000";

export async function handleLogin(_request: Request): Promise<Response> {
	const state = generateSecureRandomString(32);
	const codeVerifier = generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	const sessionId = await createSession({ state, codeVerifier });

	const authUrl = buildGoogleAuthUrl({
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: `${BASE_URL}/api/auth/callback`,
		state,
		codeChallenge,
		scope: "https://www.googleapis.com/auth/calendar.readonly",
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: authUrl,
			"Set-Cookie": `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`,
		},
	});
}

export async function handleCallback(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");

	if (error) {
		return new Response(`Authentication error: ${error}`, { status: 400 });
	}

	if (!code || !state) {
		return new Response("Missing code or state parameter", { status: 400 });
	}

	const sessionId = getSessionIdFromCookie(request);
	if (!sessionId) {
		return new Response("No session found", { status: 400 });
	}

	const session = await getSession(sessionId);
	if (!session) {
		return new Response("Invalid session", { status: 400 });
	}

	// CSRF保護: state検証
	if (session.state !== state) {
		return new Response("Invalid state parameter", { status: 400 });
	}

	try {
		const tokenResponse = await exchangeCodeForTokens({
			code,
			codeVerifier: session.codeVerifier || "",
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			redirectUri: `${BASE_URL}/api/auth/callback`,
		});

		await updateSession(sessionId, {
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token,
			expiresAt: Date.now() + tokenResponse.expires_in * 1000,
			authenticated: true,
			state: undefined,
			codeVerifier: undefined,
		});

		return new Response(null, {
			status: 302,
			headers: { Location: "/" },
		});
	} catch (error) {
		console.error("Token exchange error:", error);
		return new Response("Authentication failed", { status: 500 });
	}
}

export async function handleLogout(request: Request): Promise<Response> {
	const sessionId = getSessionIdFromCookie(request);
	if (sessionId) {
		await deleteSession(sessionId);
	}

	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Content-Type": "application/json",
			"Set-Cookie":
				"session_id=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/",
		},
	});
}

export async function handleAuthStatus(request: Request): Promise<Response> {
	const sessionId = getSessionIdFromCookie(request);
	if (!sessionId) {
		return new Response(JSON.stringify({ authenticated: false }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	const session = await getSession(sessionId);
	if (!session?.authenticated) {
		return new Response(JSON.stringify({ authenticated: false }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	// トークン期限チェック
	if (session.expiresAt && session.expiresAt <= Date.now()) {
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

				return new Response(JSON.stringify({ authenticated: true }), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (error) {
				console.error("Token refresh error:", error);
				await deleteSession(sessionId);
				return new Response(JSON.stringify({ authenticated: false }), {
					headers: { "Content-Type": "application/json" },
				});
			}
		} else {
			await deleteSession(sessionId);
			return new Response(JSON.stringify({ authenticated: false }), {
				headers: { "Content-Type": "application/json" },
			});
		}
	}

	return new Response(JSON.stringify({ authenticated: true }), {
		headers: { "Content-Type": "application/json" },
	});
}
