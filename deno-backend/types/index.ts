export interface Session {
	state?: string;
	codeVerifier?: string;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
	authenticated: boolean;
	createdAt: number;
}

export interface CalendarEvent {
	id: string;
	summary: string;
	start: {
		dateTime?: string;
		date?: string;
	};
	end: {
		dateTime?: string;
		date?: string;
	};
	location?: string;
	description?: string;
}

export interface TokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
}

export interface GoogleAuthConfig {
	client_id: string;
	client_secret: string;
	redirect_uri: string;
}
