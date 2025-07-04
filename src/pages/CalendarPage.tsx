import { useGoogleAuth } from "../auth/useGoogleAuth";
import { Calendar } from "../Calendar";

export const CalendarPage = () => {
	const { logout, user } = useGoogleAuth();

	return (
		<>
			<Calendar />
			{/* ユーザー情報とログアウトボタン */}
			<div className="fixed top-4 left-4 z-40 flex items-center space-x-3">
				{user && (
					<div className="bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 flex items-center space-x-2">
						<span className="text-sm text-gray-600">{user.name}</span>
						<button
							type="button"
							onClick={logout}
							className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
						>
							ログアウト
						</button>
					</div>
				)}
			</div>
		</>
	);
};
