import type { FamilyMember, CellLayout } from "../types";
import { EventDisplay } from "./EventDisplay";

interface FamilyMemberColumnProps {
  familyMember: FamilyMember;
  cellLayout: CellLayout;
}

export const FamilyMemberColumn = ({
  familyMember,
  cellLayout,
}: FamilyMemberColumnProps) => {
  const { startHour, endHour, cellHeight, headerHeight } = cellLayout;
  const { member, name, bgColor } = familyMember;

  return (
    <div key={member} className="flex-1 min-w-0 border-r border-blue-200 relative">
      {/* ヘッダー */}
      <div 
        className={`${bgColor} font-bold text-center border-b-2 border-blue-200 text-lg text-gray-800 flex items-center justify-center`}
        style={{ height: `${headerHeight}px` }}
      >
        {name}
      </div>

      {/* 時間スロットの背景 */}
      {Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour).map(hour => (
        <div 
          key={`bg-${member}-${hour}`} 
          className="border-b border-blue-200" 
          style={{ height: `${cellHeight}px` }}
        />
      ))}

      {/* イベント表示（絶対位置） */}
      <EventDisplay
        member={member}
        startHour={startHour}
        cellHeight={cellHeight}
        headerHeight={headerHeight}
      />
    </div>
  );
};