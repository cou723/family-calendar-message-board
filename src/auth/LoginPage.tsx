import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";
import { safeSync } from "../Calendar/shared/safeStorage";
import { useGoogleAuth } from "./useGoogleAuth";

interface GoogleJwtPayload {
	email: string;
	name: string;
	sub: string;
}

export const LoginPage = () => {
	const { isAuthenticated, login } = useGoogleAuth();
	const location = useLocation();

	// 認証済みの場合は元のページにリダイレクト
	if (isAuthenticated) {
		const from = location.state?.from?.pathname || "/";
		return <Navigate to={from} replace />;
	}

	const handleSuccess = (credentialResponse: CredentialResponse) => {
		if (credentialResponse.credential) {
			// jwtDecodeを使ってJWTトークンをデコード
			const decodeResult = safeSync(
				() =>
					jwtDecode<GoogleJwtPayload>(credentialResponse.credential as string),
				"Google credential decode failed",
			);

			if (!decodeResult.success) {
				console.error("JWT decode error:", decodeResult.error);
				return;
			}

			login({
				access_token: credentialResponse.credential,
				email: decodeResult.data.email,
				name: decodeResult.data.name,
			});
		}
	};

	const handleError = () => {
		console.log("Google Login Failed");
	};

	const handleMockLogin = () => {
		login({
			access_token: "mock-token",
			email: "demo@example.com",
			name: "デモユーザー",
		});
	};

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
						<GoogleLogin
							onSuccess={handleSuccess}
							onError={handleError}
							text="signin_with"
							shape="rectangular"
							size="large"
							width={300}
						/>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-500">
							ログインしなくてもサンプルデータでアプリを体験できます
						</p>
						<button
							type="button"
							onClick={handleMockLogin}
							className="mt-2 text-blue-500 hover:text-blue-600 text-sm underline"
						>
							サンプルデータで試す
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
