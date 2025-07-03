import type { CellLayout, FamilyMember } from "./types";

interface EventsLoadingPlaceholderProps {
	cellLayout: CellLayout;
	familyMembers: FamilyMember[];
}

export const EventsLoadingPlaceholder = ({
	cellLayout,
	familyMembers,
}: EventsLoadingPlaceholderProps) => {
	const { startHour, endHour, cellHeight, headerHeight } = cellLayout;

	return (
		<>
			{familyMembers.map((familyMember) => (
				<div
					key={`loading-${familyMember.member}`}
					className="flex-1 min-w-0 border-r border-blue-200 relative"
				>
					{/* ヘッダー */}
					<div
						className={`${familyMember.bgColor} font-bold text-center border-b-2 border-blue-200 text-lg text-gray-800 flex items-center justify-center`}
						style={{ height: `${headerHeight}px` }}
					>
						{familyMember.name}
					</div>

					{/* 時間スロットの背景 */}
					{Array.from(
						{ length: endHour - startHour + 1 },
						(_, i) => i + startHour,
					).map((hour) => (
						<div
							key={`bg-loading-${familyMember.member}-${hour}`}
							className="border-b border-blue-200"
							style={{ height: `${cellHeight}px` }}
						/>
					))}

					{/* ローディングアニメーション */}
					<div
						className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50"
						style={{ top: `${headerHeight}px` }}
					>
						<div className="flex flex-col items-center space-y-2">
							<div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-sm text-blue-600 font-medium">
								読み込み中...
							</span>
						</div>
					</div>
				</div>
			))}
		</>
	);
};
