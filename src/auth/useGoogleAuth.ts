import { useEffect, useState } from "react";
import { AppStorage } from "../Calendar/shared/appStorage";

interface GoogleUser {
	access_token: string;
	email: string;
	name: string;
}

export const useGoogleAuth = () => {
	const [user, setUser] = useState<GoogleUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// ページ読み込み時にlocalStorageから暗号化された状態を復元
		const restoreUserData = async () => {
			const authData = await AppStorage.getGoogleAuthData();

			if (authData) {
				setUser({
					access_token: authData.accessToken,
					email: authData.email,
					name: authData.name,
				});
			}
			setLoading(false);
		};

		restoreUserData();

		// auth-state-changed イベントを監視して認証状態を同期
		const handleAuthStateChanged = () => {
			console.log("認証状態変更イベントを受信、状態を再取得");
			restoreUserData();
		};

		window.addEventListener("auth-state-changed", handleAuthStateChanged);
		return () => {
			window.removeEventListener("auth-state-changed", handleAuthStateChanged);
		};
	}, []);

	const login = async (userData: GoogleUser) => {
		// ユーザーデータを暗号化してlocalStorageに保存
		const success = await AppStorage.setGoogleAuthData({
			accessToken: userData.access_token,
			email: userData.email,
			name: userData.name,
		});

		if (success) {
			setUser(userData);
		} else {
			console.error("Google認証データの保存に失敗しました");
		}
	};

	const logout = () => {
		// localStorageをクリア（暗号化キーも削除）
		const success = AppStorage.clearGoogleAuthData();

		if (!success) {
			console.error("Google認証データの削除に失敗しました");
		}

		setUser(null);
		window.location.reload(); // 状態をリセット
	};

	return {
		user,
		loading,
		isAuthenticated: !!user,
		login,
		logout,
	};
};
