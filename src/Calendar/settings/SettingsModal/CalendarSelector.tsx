import { useCallback, useEffect, useState } from "react";
import { getAvailableCalendars } from "../../data/calendarDataProvider";
import { getCalendarDataProvider } from "../../data/calendarDataService";
import type { GoogleCalendarInfo } from "../../shared/types";

interface CalendarSelectorProps {
	value: string;
	onChange: (calendarId: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

export const CalendarSelector = ({
	value,
	onChange,
	placeholder = "カレンダーを選択してください",
	disabled = false,
}: CalendarSelectorProps) => {
	const [calendars, setCalendars] = useState<GoogleCalendarInfo[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCalendarList = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			// 認証済みのデータプロバイダーを取得
			const provider = getCalendarDataProvider();
			if (!provider) {
				setError("Googleカレンダーにアクセスするには認証が必要です");
				setCalendars([]);
				setIsLoading(false);
				return;
			}

			// 実際のGoogleカレンダー一覧を取得
			const availableCalendars = await getAvailableCalendars(provider);

			// GoogleCalendarInfo形式に変換
			const calendarInfos: GoogleCalendarInfo[] = availableCalendars.map(
				(cal) => ({
					id: cal.id,
					summary: cal.name,
					primary: cal.id === "primary",
					accessRole: "owner", // API戻り値に含まれていないため、デフォルト値を設定
				}),
			);

			setCalendars(calendarInfos);
		} catch (err) {
			let errorMessage = "カレンダー一覧の取得に失敗しました";

			if (err instanceof Error) {
				if (err.message.includes("認証が必要です")) {
					errorMessage =
						"認証の有効期限が切れています。再度ログインしてください。";
				} else if (err.message.includes("401")) {
					errorMessage =
						"認証の有効期限が切れています。再度ログインしてください。";
				} else {
					errorMessage = err.message;
				}
			}

			setError(errorMessage);
			setCalendars([]);
		}

		setIsLoading(false);
	}, []);

	// コンポーネント初回表示時にカレンダーリストを取得
	useEffect(() => {
		if (calendars.length === 0 && !isLoading && !error) {
			fetchCalendarList();
		}
	}, [calendars.length, isLoading, error, fetchCalendarList]);

	const handleRefresh = () => {
		fetchCalendarList();
	};

	const formatCalendarOption = (calendar: GoogleCalendarInfo): string => {
		let displayName = calendar.summary;

		if (calendar.primary) {
			displayName += " (メイン)";
		}

		// アクセス権限の表示
		const roleText =
			calendar.accessRole === "owner"
				? "オーナー"
				: calendar.accessRole === "writer"
					? "編集者"
					: "閲覧者";
		displayName += ` - ${roleText}`;

		return displayName;
	};

	return (
		<div className="space-y-2">
			<div className="flex items-stretch gap-2">
				<select
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled || isLoading}
					className="flex-1 px-3 py-2 border border-gray-300 rounded text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
				>
					<option value="" className="text-gray-500">
						{placeholder}
					</option>
					{calendars.map((calendar: GoogleCalendarInfo) => (
						<option
							key={calendar.id}
							value={calendar.id}
							className="text-gray-900"
						>
							{formatCalendarOption(calendar)}
						</option>
					))}
				</select>

				<button
					type="button"
					onClick={handleRefresh}
					disabled={isLoading}
					className="flex-shrink-0 px-2 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[2.5rem]"
					title="カレンダーリストを更新"
				>
					{isLoading ? "..." : "🔄"}
				</button>
			</div>

			{/* 状態表示 */}
			{isLoading && (
				<div className="text-sm text-blue-600 flex items-center gap-2">
					<div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
					カレンダー一覧を読み込み中...
				</div>
			)}

			{error && (
				<div className="text-sm text-red-600">
					{error}
					{(error.includes("認証") || error.includes("401")) && (
						<div className="mt-2 text-xs text-gray-600">
							ページを再読み込みして再度ログインしてください。
						</div>
					)}
				</div>
			)}

			{!isLoading && !error && calendars.length === 0 && (
				<div className="text-sm text-gray-600">
					アクセス可能なカレンダーが見つかりません
				</div>
			)}

			{/* 手動入力オプション */}
			<div className="text-xs text-gray-500">
				または直接カレンダーIDを入力：
			</div>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="primary または example@gmail.com"
				className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>
	);
};
