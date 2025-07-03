// Google API JavaScript Client (gapi) を使用したブラウザ用認証
declare global {
	interface Window {
		gapi: any;
		google: any;
	}
}

// Google Calendar APIのスコープ
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let isGapiLoaded = false;
let isGisLoaded = false;
let tokenClient: any = null;

// トークン保存用のキー
const STORAGE_KEYS = {
	ACCESS_TOKEN: "google_access_token",
	REFRESH_TOKEN: "google_refresh_token",
	EXPIRES_AT: "google_token_expires_at",
} as const;

/**
 * Google API JavaScript Clientを初期化
 */
export const initializeGapi = async (): Promise<boolean> => {
	try {
		// gapi.jsを動的にロード
		if (!window.gapi) {
			await loadScript("https://apis.google.com/js/api.js");
		}

		// Google Identity Services (GIS)を動的にロード
		if (!window.google) {
			await loadScript("https://accounts.google.com/gsi/client");
		}

		// gapi初期化
		await new Promise<void>((resolve) => {
			window.gapi.load("client", resolve);
		});

		await window.gapi.client.init({
			discoveryDocs: [
				"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
			],
		});

		isGapiLoaded = true;

		// Google Identity Services初期化
		tokenClient = window.google.accounts.oauth2.initTokenClient({
			client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
			scope: SCOPES,
			callback: "", // コールバックは後で設定
		});

		// 保存されたトークンがあれば復元
		await restoreStoredToken();

		isGisLoaded = true;
		return true;
	} catch (error) {
		console.error("Google API初期化エラー:", error);
		return false;
	}
};

/**
 * スクリプトを動的にロード
 */
function loadScript(src: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
		document.head.appendChild(script);
	});
}

/**
 * Google認証を実行
 */
export const authenticateGoogle = (): Promise<boolean> => {
	return new Promise(async (resolve) => {
		if (!isGapiLoaded || !isGisLoaded || !tokenClient) {
			console.error("Google APIが初期化されていません");
			resolve(false);
			return;
		}

		tokenClient.callback = async (response: any) => {
			if (response.error) {
				console.error("認証エラー:", response.error);
				resolve(false);
				return;
			}

			// トークンを保存
			saveTokenToStorage(response);

			// 認証成功
			console.log("Google認証成功");
			resolve(true);
		};

		// 既存のアクセストークンがあるかチェック
		if (window.gapi.client.getToken() === null) {
			// 保存されたトークンを試す
			const hasValidToken = await restoreStoredToken();
			if (hasValidToken) {
				resolve(true);
			} else {
				// トークンリクエストを開始
				tokenClient.requestAccessToken({ prompt: "consent" });
			}
		} else {
			resolve(true);
		}
	});
};

/**
 * 認証状態を確認
 */
export const isAuthenticated = (): boolean => {
	if (!isGapiLoaded) return false;
	const token = window.gapi?.client?.getToken();
	if (token !== null && token !== undefined) {
		// トークンの有効期限をチェック
		return !isTokenExpired();
	}
	return false;
};

/**
 * 認証済みのGoogle Calendar APIクライアントを取得
 */
export const getGapiCalendarClient = () => {
	if (!isAuthenticated()) {
		throw new Error("Google認証が完了していません");
	}
	return window.gapi.client.calendar;
};

/**
 * ログアウト処理
 */
export const logout = () => {
	if (window.gapi?.client?.getToken()) {
		window.google.accounts.oauth2.revoke(
			window.gapi.client.getToken().access_token,
		);
		window.gapi.client.setToken("");
	}
	// ローカルストレージからもトークンを削除
	clearStoredTokens();
};

/**
 * トークンをローカルストレージに保存
 */
function saveTokenToStorage(tokenResponse: any): void {
	try {
		const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
		
		localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.access_token);
		localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
		
		// リフレッシュトークンは初回認証時のみ取得される
		if (tokenResponse.refresh_token) {
			localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenResponse.refresh_token);
		}
		
		console.log("トークンをローカルストレージに保存しました");
	} catch (error) {
		console.error("トークン保存エラー:", error);
	}
}

/**
 * 保存されたトークンを復元
 */
async function restoreStoredToken(): Promise<boolean> {
	try {
		const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
		const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
		
		if (!accessToken || !expiresAt) {
			return false;
		}
		
		const expirationTime = parseInt(expiresAt);
		const now = Date.now();
		
		// トークンが期限切れかチェック
		if (now >= expirationTime) {
			console.log("保存されたトークンは期限切れです");
			const refreshed = await refreshAccessToken();
			return refreshed;
		}
		
		// 有効なトークンを設定
		window.gapi.client.setToken({
			access_token: accessToken,
			expires_in: Math.floor((expirationTime - now) / 1000),
		});
		
		console.log("保存されたトークンを復元しました");
		return true;
	} catch (error) {
		console.error("トークン復元エラー:", error);
		return false;
	}
}

/**
 * リフレッシュトークンを使ってアクセストークンを更新
 */
async function refreshAccessToken(): Promise<boolean> {
	try {
		const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
		
		if (!refreshToken) {
			console.log("リフレッシュトークンが見つかりません");
			return false;
		}
		
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				refresh_token: refreshToken,
				grant_type: "refresh_token",
			}),
		});
		
		if (!response.ok) {
			console.error("トークン更新に失敗:", response.statusText);
			clearStoredTokens();
			return false;
		}
		
		const tokenData = await response.json();
		
		// 新しいトークンを設定
		window.gapi.client.setToken({
			access_token: tokenData.access_token,
			expires_in: tokenData.expires_in,
		});
		
		// 新しいトークンを保存（リフレッシュトークンは更新されない場合が多い）
		saveTokenToStorage({
			access_token: tokenData.access_token,
			expires_in: tokenData.expires_in,
		});
		
		console.log("アクセストークンを更新しました");
		return true;
	} catch (error) {
		console.error("トークン更新エラー:", error);
		clearStoredTokens();
		return false;
	}
}

/**
 * トークンの有効期限をチェック
 */
function isTokenExpired(): boolean {
	const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
	if (!expiresAt) return true;
	
	const expirationTime = parseInt(expiresAt);
	const now = Date.now();
	
	// 5分前に期限切れとして扱う（余裕を持たせる）
	return now >= (expirationTime - 5 * 60 * 1000);
}

/**
 * 保存されたトークンをクリア
 */
function clearStoredTokens(): void {
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
	console.log("保存されたトークンをクリアしました");
}
