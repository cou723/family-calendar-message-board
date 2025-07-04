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
			<div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<div className="flex items-center space-x-3">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
						<span className="text-gray-700">読み込み中...</span>
					</div>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};
