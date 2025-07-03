interface AuthStatusProps {
	isAuthenticated: boolean;
	isAuthenticating: boolean;
	authError: string | null;
	useMockData: boolean;
	onAuthenticate: () => void;
	onLogout?: () => void;
}

export const AuthStatus = ({
	isAuthenticated,
	isAuthenticating,
	authError,
	useMockData,
	onAuthenticate,
	onLogout,
}: AuthStatusProps) => {
	// 認証済みの場合はログアウトボタンのみ表示
	if (isAuthenticated && !authError && !useMockData) {
		return onLogout ? (
			<div className="fixed top-4 left-4 z-40">
				<button
					type="button"
					onClick={onLogout}
					className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 transition-colors"
				>
					ログアウト
				</button>
			</div>
		) : null;
	}

	// エラーまたは未認証時のみ大きなパネルを表示
	if (!isAuthenticated || authError) {
		return (
			<div className="fixed top-16 left-4 right-4 z-50">
				<div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md mx-auto">
					{isAuthenticating ? (
						<div className="flex items-center space-x-3">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
							<span className="text-base text-gray-700">Google認証中...</span>
						</div>
					) : (
						<>
							{authError && (
								<div className="mb-3">
									<div className="text-sm text-orange-600 mb-2">
										{authError}
									</div>
									{useMockData && (
										<div className="text-sm text-blue-600">
											現在はサンプルデータを表示しています
										</div>
									)}
								</div>
							)}

							{!isAuthenticated && !useMockData && (
								<button
									type="button"
									onClick={onAuthenticate}
									className="w-full bg-blue-500 text-white px-4 py-2 rounded text-base font-semibold hover:bg-blue-600 transition-colors"
								>
									Googleカレンダーに接続
								</button>
							)}

							{useMockData && (
								<button
									type="button"
									onClick={onAuthenticate}
									className="w-full bg-green-500 text-white px-4 py-2 rounded text-base font-semibold hover:bg-green-600 transition-colors"
								>
									Google認証を再試行
								</button>
							)}
						</>
					)}
				</div>
			</div>
		);
	}

	return null;
};
