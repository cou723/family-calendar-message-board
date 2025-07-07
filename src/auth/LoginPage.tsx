import {
	Button,
	Center,
	Container,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useGoogleLogin } from "@react-oauth/google";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage = () => {
	const { isAuthenticated, login } = useAuth();
	const location = useLocation();

	// カレンダーアクセス用のログイン（アクセストークンを取得）
	const calendarLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const { fetchGoogleUserInfo } = await import("./googleAuthApi");
				const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);

				await login({
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
		state: crypto.randomUUID(), // CSRF保護のためのstateパラメータ
		flow: "implicit", // ポップアップフローを明示的に指定
	});

	// 認証済みの場合は元のページにリダイレクト
	if (isAuthenticated) {
		const from = location.state?.from?.pathname || "/";
		return <Navigate to={from} replace />;
	}

	return (
		<Center
			style={{ height: "100vh", width: "100vw", backgroundColor: "#f3f4f6" }}
		>
			<Container size="sm">
				<Paper shadow="lg" p="xl" radius="lg" ta="center" withBorder>
					<Stack gap="xl">
						<Stack gap="sm">
							<Title order={1} size="3xl" c="#374151">
								家族カレンダー
							</Title>
							<Text size="md" c="dimmed">
								Googleアカウントでログインしてご家族の予定を表示します
							</Text>
						</Stack>

						<Button onClick={() => calendarLogin()} size="lg" fullWidth>
							Googleカレンダーでログイン
						</Button>
					</Stack>
				</Paper>
			</Container>
		</Center>
	);
};
