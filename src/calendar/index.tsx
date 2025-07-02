import { useCellLayout } from "./useCellLayout";
import { useDateNavigation } from "./useDateNavigation";
import { useSettings } from "./useSettings";
import { useSwipeState } from "./useSwipeState";
import { useTouchNavigation } from "./useTouchNavigation";
import { CalendarHeader } from "./CalendarHeader";
import { TimeColumn } from "./TimeColumn";
import { FamilyMemberColumn } from "./familyMemberColumn";
import { TodayButton } from "./TodayButton";
import { LoadingIndicator } from "./LoadingIndicator";
import { SettingsModal } from "./settingsModal";
import type { FamilyMember } from "./types";

export const Calendar = () => {
  const { timeRange, settingsModal, settingsControl } = useSettings();
  const { cellHeight, headerHeight } = useCellLayout(timeRange.startHour, timeRange.endHour);
  const { currentDate, actions } = useDateNavigation();
  const { swipe } = useSwipeState();

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

  const familyMembers: FamilyMember[] = [
    { member: "father", name: "お父さん", bgColor: "bg-blue-100" },
    { member: "mother", name: "お母さん", bgColor: "bg-red-100" },
    { member: "son1", name: "長男", bgColor: "bg-green-100" },
    { member: "son2", name: "次男", bgColor: "bg-yellow-100" }
  ];

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

          {/* 家族メンバーカラム */}
          {familyMembers.map((familyMember) => (
            <FamilyMemberColumn
              key={familyMember.member}
              familyMember={familyMember}
              cellLayout={cell}
            />
          ))}
        </div>
      </div>

      {/* フローティングボタン */}
      <TodayButton goToToday={actions.goToToday} />
      
      {/* ローディングインジケーター */}
      <LoadingIndicator isDateChanging={currentDate.isDateChanging} />

      {/* 設定モーダル */}
      <SettingsModal
        isSettingsOpen={settingsModal.isOpen}
        setIsSettingsOpen={settingsModal.setIsOpen}
        startHour={cell.startHour}
        setStartHour={settingsControl.setStartHour}
        endHour={cell.endHour}
        setEndHour={settingsControl.setEndHour}
      />
    </div>
  );
};