import { useGoogleLogin } from "@react-oauth/google";
import { Navigate, useLocation } from "react-router-dom";
import { useGoogleAuth } from "./useGoogleAuth";

export const LoginPage = () => {
	const { isAuthenticated, login } = useGoogleAuth();
	const location = useLocation();

	// カレンダーアクセス用のログイン（アクセストークンを取得）
	const calendarLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const { fetchGoogleUserInfo } = await import("./googleAuthApi");
				const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);

				login({
					access_token: tokenResponse.access_token,
					email: userInfo.email,
					name: userInfo.name,
				});
			} catch (error) {
				console.error("Failed to fetch user info:", error);
			}
		},
		onError: (error) => {
			console.error("Google Calendar Login Failed:", error);
		},
		scope: "https://www.googleapis.com/auth/calendar.readonly",
	});

	// 認証済みの場合は元のページにリダイレクト
	if (isAuthenticated) {
		const from = location.state?.from?.pathname || "/";
		return <Navigate to={from} replace />;
	}

	return (
		<div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						家族カレンダー
					</h1>
					<p className="text-gray-600 mb-8">
						Googleアカウントでログインしてご家族の予定を表示します
					</p>

					<div className="mb-6">
						<button
							type="button"
							onClick={() => calendarLogin()}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
						>
							Googleカレンダーでログイン
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
