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
		// ページ読み込み時にlocalStorageから暗号化された状態を復元
		const restoreUserData = async () => {
			const tokenResult = await SafeStorage.getItemEncrypted(
				"google-access-token",
			);
			const emailResult =
				await SafeStorage.getItemEncrypted("google-user-email");
			const nameResult = await SafeStorage.getItemEncrypted("google-user-name");

			// アクセストークンがあれば認証済みとして扱う
			if (tokenResult.success && tokenResult.data) {
				setUser({
					access_token: tokenResult.data,
					email:
						emailResult.success && emailResult.data
							? emailResult.data
							: "unknown@example.com",
					name:
						nameResult.success && nameResult.data
							? nameResult.data
							: "ユーザー",
				});
			} else {
				// トークンがない、または取得に失敗した場合のログ出力
				if (!tokenResult.success)
					console.warn("暗号化トークン取得失敗:", tokenResult.error);
				if (!emailResult.success)
					console.warn("暗号化メール取得失敗:", emailResult.error);
				if (!nameResult.success)
					console.warn("暗号化名前取得失敗:", nameResult.error);
			}
			setLoading(false);
		};

		restoreUserData();
	}, []);

	const login = async (userData: GoogleUser) => {
		// ユーザーデータを暗号化してlocalStorageに保存
		const tokenResult = await SafeStorage.setItemEncrypted(
			"google-access-token",
			userData.access_token,
		);
		const emailResult = await SafeStorage.setItemEncrypted(
			"google-user-email",
			userData.email,
		);
		const nameResult = await SafeStorage.setItemEncrypted(
			"google-user-name",
			userData.name,
		);

		// 保存エラーの確認
		if (!tokenResult.success)
			console.error("暗号化トークン保存失敗:", tokenResult.error);
		if (!emailResult.success)
			console.error("暗号化メール保存失敗:", emailResult.error);
		if (!nameResult.success)
			console.error("暗号化名前保存失敗:", nameResult.error);

		setUser(userData);
	};

	const logout = () => {
		// localStorageをクリア（暗号化キーも削除）
		const tokenResult = SafeStorage.removeItem("google-access-token");
		const emailResult = SafeStorage.removeItem("google-user-email");
		const nameResult = SafeStorage.removeItem("google-user-name");
		const keyResult = SafeStorage.removeItem("encryption-key");

		// 削除エラーの確認
		if (!tokenResult.success)
			console.error("トークン削除失敗:", tokenResult.error);
		if (!emailResult.success)
			console.error("メール削除失敗:", emailResult.error);
		if (!nameResult.success) console.error("名前削除失敗:", nameResult.error);
		if (!keyResult.success)
			console.error("暗号化キー削除失敗:", keyResult.error);

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
