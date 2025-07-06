import { Button, Group, Paper, Text } from "@mantine/core";
import { useGoogleAuth } from "../auth/useGoogleAuth";
import { Calendar } from "../Calendar";

export const CalendarPage = () => {
	const { logout, user } = useGoogleAuth();

	return (
		<>
			<Calendar />
			{/* ユーザー情報とログアウトボタン */}
			<Paper
				shadow="sm"
				withBorder
				p="sm"
				style={{
					position: "fixed",
					top: 16,
					left: 16,
					zIndex: 40,
				}}
			>
				{user && (
					<Group gap="sm">
						<Text size="sm" c="dimmed">
							{user.name}
						</Text>
						<Button color="red" size="xs" onClick={logout}>
							ログアウト
						</Button>
					</Group>
				)}
			</Paper>
		</>
	);
};
