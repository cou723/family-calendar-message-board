import { Box } from "@mantine/core";
import { useCalendarEvents } from "../../data/queries/useCalendarEvents";
import { EventsLoadingPlaceholder } from "../../display/EventsLoadingPlaceholder";
import { FamilyMemberColumn } from "../../display/FamilyMemberColumn";
import { TimeColumn } from "../../display/TimeColumn";
import type { FamilyMember } from "../../shared/types";
import { useDateNavigation } from "../../shared/useDateNavigation";
import { useSettings } from "../../shared/useSettings";
import { useCellLayout } from "./useCellLayout";

export const CalendarGrid = () => {
	const { timeRange, familyCalendars } = useSettings();
	const { cellHeight, headerHeight } = useCellLayout(
		timeRange.startHour,
		timeRange.endHour,
	);
	const { currentDate } = useDateNavigation();
	const { data: events, isLoading: isLoadingEvents } = useCalendarEvents({
		date: currentDate.date,
		familyCalendars,
		enabled: true,
	});

	const cell = {
		...timeRange,
		cellHeight,
		headerHeight,
	};

	// familyCalendarsから家族メンバー情報を取得
	const familyMembers: FamilyMember[] = familyCalendars.map((calendar) => ({
		member: calendar.member,
		name: calendar.name,
		color: calendar.color,
		calendarIds: calendar.calendarIds,
	}));

	return (
		<Box
			flex={1}
			style={{
				overflow: "auto",
				minHeight: 0,
				display: "flex",
				background: "white",
			}}
		>
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
						events={events || []}
					/>
				))
			)}
		</Box>
	);
};
