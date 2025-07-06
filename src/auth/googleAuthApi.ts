import { safeAsync } from "../Calendar/shared/safeStorage";

export interface GoogleUserInfo {
	email: string;
	name: string;
	picture?: string;
}

export interface GoogleTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
}

/**
 * Google OAuth2 APIを使用してユーザー情報を取得
 */
export const fetchGoogleUserInfo = async (
	accessToken: string,
): Promise<GoogleUserInfo> => {
	const result = await safeAsync(
		() =>
			fetch(
				`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
			),
		"Failed to fetch user info from Google API",
	);

	if (!result.success) {
		throw new Error(result.error);
	}

	const response = result.data;
	if (!response.ok) {
		throw new Error(
			`Google API error: ${response.status} ${response.statusText}`,
		);
	}

	const userInfoResult = await safeAsync(
		() => response.json(),
		"Failed to parse user info response",
	);

	if (!userInfoResult.success) {
		throw new Error(userInfoResult.error);
	}

	return userInfoResult.data;
};

/**
 * Google Calendar API用のアクセストークンを検証
 */
export const validateCalendarToken = async (
	accessToken: string,
): Promise<boolean> => {
	try {
		const result = await safeAsync(
			() =>
				fetch(
					`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
				),
			"Failed to validate access token",
		);

		if (!result.success) {
			return false;
		}

		const response = result.data;
		if (!response.ok) {
			return false;
		}

		const tokenInfo = await response.json();

		// カレンダーアクセスのスコープが含まれているか確認
		return tokenInfo.scope?.includes(
			"https://www.googleapis.com/auth/calendar",
		);
	} catch (error) {
		console.error("Token validation error:", error);
		return false;
	}
};
