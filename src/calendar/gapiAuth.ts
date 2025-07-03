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
	return new Promise((resolve) => {
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

			// 認証成功
			console.log("Google認証成功");
			resolve(true);
		};

		// 既存のアクセストークンがあるかチェック
		if (window.gapi.client.getToken() === null) {
			// トークンリクエストを開始
			tokenClient.requestAccessToken({ prompt: "consent" });
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
	return token !== null && token !== undefined;
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
};
