import { useEffect, useState } from "react";
import { SafeStorage } from "../Calendar/shared/safeStorage";

interface GoogleUser {
	access_token: string;
	email: string;
	name: string;
}

export const useGoogleAuth = () => {
	const [user, setUser] = useState<GoogleUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// ページ読み込み時にlocalStorageから状態を復元
		const tokenResult = SafeStorage.getItem("google-access-token");
		const emailResult = SafeStorage.getItem("google-user-email");
		const nameResult = SafeStorage.getItem("google-user-name");

		if (
			tokenResult.success &&
			tokenResult.data &&
			emailResult.success &&
			emailResult.data &&
			nameResult.success &&
			nameResult.data
		) {
			setUser({
				access_token: tokenResult.data,
				email: emailResult.data,
				name: nameResult.data,
			});
		} else {
			// いずれかの取得に失敗した場合はログを出力
			if (!tokenResult.success)
				console.warn("トークン取得失敗:", tokenResult.error);
			if (!emailResult.success)
				console.warn("メール取得失敗:", emailResult.error);
			if (!nameResult.success) console.warn("名前取得失敗:", nameResult.error);
		}
		setLoading(false);
	}, []);

	const login = (userData: GoogleUser) => {
		// ユーザーデータをlocalStorageに保存
		const tokenResult = SafeStorage.setItem(
			"google-access-token",
			userData.access_token,
		);
		const emailResult = SafeStorage.setItem(
			"google-user-email",
			userData.email,
		);
		const nameResult = SafeStorage.setItem("google-user-name", userData.name);

		// 保存エラーの確認
		if (!tokenResult.success)
			console.error("トークン保存失敗:", tokenResult.error);
		if (!emailResult.success)
			console.error("メール保存失敗:", emailResult.error);
		if (!nameResult.success) console.error("名前保存失敗:", nameResult.error);

		setUser(userData);
	};

	const logout = () => {
		// localStorageをクリア
		const tokenResult = SafeStorage.removeItem("google-access-token");
		const emailResult = SafeStorage.removeItem("google-user-email");
		const nameResult = SafeStorage.removeItem("google-user-name");

		// 削除エラーの確認
		if (!tokenResult.success)
			console.error("トークン削除失敗:", tokenResult.error);
		if (!emailResult.success)
			console.error("メール削除失敗:", emailResult.error);
		if (!nameResult.success) console.error("名前削除失敗:", nameResult.error);

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
