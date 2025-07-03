import { useCallback, useEffect, useState } from "react";
import { AuthClient } from "../../api/auth";
import type { IAuthClient } from "./IAuthClient";

interface UseAuthOptions {
	authClient?: IAuthClient;
}

export const useAuth = (options: UseAuthOptions = {}) => {
	const authClient = options.authClient || new AuthClient();
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [useMockData, setUseMockData] = useState(false);

	const checkAuthStatus = useCallback(async () => {
		try {
			console.log("🔍 Frontend: Checking authentication status...");
			const authenticated = await authClient.checkAuthStatus();
			console.log("🔍 Frontend: Authentication result:", authenticated);

			setIsAuthenticated(authenticated);
			if (authenticated) {
				setUseMockData(false);
				setAuthError(null);
				console.log("✅ Frontend: User is authenticated");
			} else {
				setUseMockData(true);
				setAuthError("認証が必要です。モックデータを使用します。");
				console.log("❌ Frontend: User is not authenticated");
			}
		} catch (error) {
			console.error("認証状態確認エラー:", error);
			setIsAuthenticated(false);
			setUseMockData(true);
			setAuthError("認証状態の確認に失敗しました。モックデータを使用します。");
		}
	}, [authClient.checkAuthStatus]);

	// 認証状態の初期チェック（OAuth認証後の戻り時を考慮）
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			checkAuthStatus();
		}, 100); // わずかな遅延を追加

		return () => clearTimeout(timeoutId);
	}, [checkAuthStatus]);

	/**
	 * Google認証を実行
	 */
	const authenticate = async (): Promise<boolean> => {
		setIsAuthenticating(true);
		setAuthError(null);

		try {
			await authClient.login();
			return true;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			setAuthError(`認証エラー: ${errorMessage}。モックデータを使用します。`);
			setUseMockData(true);
			return false;
		} finally {
			setIsAuthenticating(false);
		}
	};

	/**
	 * ログアウト処理
	 */
	const logout = async () => {
		try {
			await authClient.logout();
			setIsAuthenticated(false);
			setUseMockData(true);
			setAuthError("ログアウトしました。モックデータを使用します。");
		} catch (error) {
			console.error("ログアウトエラー:", error);
		}
	};

	return {
		// 認証状態
		isAuthenticated: useMockData || isAuthenticated,
		isAuthenticating,
		authError,
		useMockData,

		// 認証アクション
		authenticate,
		logout,
		checkAuthStatus,
	};
};
