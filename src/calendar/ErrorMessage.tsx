import type { CalendarError } from "../google-calendar/types";

interface ErrorMessageProps {
	error: CalendarError;
	onRetry?: () => void;
	className?: string;
}

export const ErrorMessage = ({
	error,
	onRetry,
	className = "",
}: ErrorMessageProps) => {
	const getErrorMessage = (error: CalendarError): string => {
		switch (error.type) {
			case "GOOGLE_API_ERROR":
				return `Google API エラー: ${error.message}`;
			case "NETWORK_ERROR":
				return `ネットワークエラー: ${error.message}`;
			case "PERMISSION_ERROR":
				return "カレンダーへのアクセス権限が必要です。認証を行ってください。";
			case "INITIALIZATION_ERROR":
				return `初期化エラー: ${error.message}`;
			default:
				return "予期しないエラーが発生しました。";
		}
	};

	return (
		<div className={`
			flex flex-col items-center justify-center p-8 
			bg-red-50 border-2 border-red-200 rounded-lg
			${className}
		`}>
			<div className="text-6xl mb-4">⚠️</div>
			<h2 className="text-2xl font-bold text-red-800 mb-4">
				エラーが発生しました
			</h2>
			<p className="text-lg text-red-700 text-center mb-6 max-w-md">
				{getErrorMessage(error)}
			</p>
			{onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="
						px-6 py-3 text-lg font-semibold text-white 
						bg-red-600 rounded-lg hover:bg-red-700 
						focus:outline-none focus:ring-4 focus:ring-red-300 
						transition-colors
					"
				>
					再試行
				</button>
			)}
		</div>
	);
};