import type { GoogleAuthConfig, TokenResponse } from "../types/index.ts";

export function buildGoogleAuthUrl(
	config: GoogleAuthConfig & {
		state: string;
		codeChallenge: string;
		scope: string;
	},
): string {
	const params = new URLSearchParams({
		client_id: config.client_id,
		redirect_uri: config.redirect_uri,
		response_type: "code",
		scope: config.scope,
		access_type: "offline",
		prompt: "consent",
		state: config.state,
		code_challenge: config.codeChallenge,
		code_challenge_method: "S256",
	});

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(params: {
	code: string;
	codeVerifier: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}): Promise<TokenResponse> {
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: params.clientId,
			client_secret: params.clientSecret,
			code: params.code,
			grant_type: "authorization_code",
			redirect_uri: params.redirectUri,
			code_verifier: params.codeVerifier,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Token exchange failed: ${error}`);
	}

	return await response.json();
}

export async function refreshAccessToken(
	refreshToken: string,
	clientId: string,
	clientSecret: string,
): Promise<TokenResponse> {
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: "refresh_token",
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Token refresh failed: ${error}`);
	}

	return await response.json();
}
