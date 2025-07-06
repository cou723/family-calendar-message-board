import { Center, Group, Loader, Paper, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGoogleAuth } from "./useGoogleAuth";

interface RequireAuthProps {
	children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
	const { isAuthenticated, loading } = useGoogleAuth();
	const location = useLocation();

	if (loading) {
		return (
			<Center
				style={{ height: "100vh", width: "100vw", backgroundColor: "#f3f4f6" }}
			>
				<Paper shadow="lg" p="xl" radius="lg">
					<Group gap="md">
						<Loader color="blue" size="sm" />
						<Text c="dimmed">読み込み中...</Text>
					</Group>
				</Paper>
			</Center>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};
