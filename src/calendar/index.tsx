import { useEffect } from "react";
import { AuthStatus } from "./AuthStatus";
import { CalendarHeader } from "./CalendarHeader";
import { EventsLoadingPlaceholder } from "./EventsLoadingPlaceholder";
import { FamilyMemberColumn } from "./familyMemberColumn";
import { SettingsModal } from "./settingsModal";
import { TimeColumn } from "./TimeColumn";
import { TodayButton } from "./TodayButton";
import type { FamilyMember } from "./types";
import { useCellLayout } from "./useCellLayout";
import { useDateNavigation } from "./useDateNavigation";
import { useGoogleCalendar } from "./useGoogleCalendar";
import { useSettings } from "./useSettings";
import { useSwipeState } from "./useSwipeState";
import { useTouchNavigation } from "./useTouchNavigation";

export const Calendar = () => {
	const { timeRange, settingsModal, settingsControl } = useSettings();
	const { cellHeight, headerHeight } = useCellLayout(
		timeRange.startHour,
		timeRange.endHour,
	);
	const { currentDate, actions } = useDateNavigation();
	const { swipe } = useSwipeState();
	const {
		events,
		isLoadingEvents,
		isAuthenticated,
		authenticate,
		authError,
		isAuthenticating,
		useMockData,
		familyCalendars,
		updateFamilyCalendars,
		logout,
	} = useGoogleCalendar(currentDate.date);

	const cell = {
		...timeRange,
		cellHeight,
		headerHeight,
	};

	const { handleTouchStart, handleTouchEnd } = useTouchNavigation({
		startX: swipe.startX,
		setStartX: swipe.setStartX,
		goToNextDay: actions.goToNextDay,
		goToPreviousDay: actions.goToPreviousDay,
	});

	// familyCalendarsから家族メンバー情報を取得
	const familyMembers: FamilyMember[] = familyCalendars.map((calendar) => ({
		member: calendar.member,
		name: calendar.name,
		bgColor: calendar.bgColor,
	}));

	// TanStack Queryが日付変更を自動的に検知するため、useEffectは不要

	// アプリ起動時に認証チェック
	useEffect(() => {
		if (!isAuthenticated) {
			authenticate();
		}
	}, []);

	return (
		<div
			className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{/* ヘッダー - 固定高さ */}
			<CalendarHeader
				currentDate={currentDate.date}
				isDateChanging={currentDate.isDateChanging}
				setIsSettingsOpen={settingsModal.setIsOpen}
			/>

			{/* カレンダーグリッド - 残り画面を使用 */}
			<div className="flex-1 overflow-hidden min-h-0">
				<div className="h-full w-full flex bg-white overflow-auto">
					{/* 時間軸 */}
					<TimeColumn cellLayout={cell} />

					{/* 家族メンバーカラム（ローディング時は専用表示） */}
					{isLoadingEvents ? (
						<EventsLoadingPlaceholder
							cellLayout={cell}
							familyMembers={familyMembers}
						/>
					) : (
						familyMembers.map((familyMember) => (
							<FamilyMemberColumn
								key={familyMember.member}
								familyMember={familyMember}
								cellLayout={cell}
								events={events}
							/>
						))
					)}
				</div>
			</div>


			{/* フローティングボタン */}
			<TodayButton goToToday={actions.goToToday} />

			{/* 設定モーダル */}
			<SettingsModal
				isSettingsOpen={settingsModal.isOpen}
				setIsSettingsOpen={settingsModal.setIsOpen}
				startHour={cell.startHour}
				setStartHour={settingsControl.setStartHour}
				endHour={cell.endHour}
				setEndHour={settingsControl.setEndHour}
				familyCalendars={familyCalendars}
				onUpdateCalendars={updateFamilyCalendars}
			/>

			{/* 認証状態表示 */}
			<AuthStatus
				isAuthenticated={isAuthenticated}
				isAuthenticating={isAuthenticating}
				authError={authError}
				useMockData={useMockData}
				onAuthenticate={authenticate}
				onLogout={logout}
			/>
		</div>
	);
};
