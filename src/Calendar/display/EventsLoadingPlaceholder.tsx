import { Box, Center, Loader, Overlay, Text } from "@mantine/core";
import type { CellLayout, FamilyMember } from "../shared/types";

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
				<Box
					key={`loading-${familyMember.member}`}
					flex={1}
					style={{
						minWidth: 0,
						position: "relative",
					}}
				>
					{/* ヘッダー */}
					<Box
						ta="center"
						style={{
							height: `${headerHeight}px`,
							backgroundColor: familyMember.color,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text fw={700} size="lg" c="#374151">
							{familyMember.name}
						</Text>
					</Box>

					{/* 時間スロットの背景 */}
					<Box>
						{Array.from(
							{ length: endHour - startHour + 1 },
							(_, i) => i + startHour,
						).map((hour) => (
							<Box
								key={`bg-loading-${familyMember.member}-${hour}`}
								style={{
									height: `${cellHeight}px`,
								}}
							/>
						))}
					</Box>

					{/* ローディングアニメーション */}
					<Overlay
						backgroundOpacity={0.5}
						style={{
							top: `${headerHeight}px`,
							backgroundColor: "rgba(255, 255, 255, 0.5)",
						}}
					>
						<Center h="100%">
							<Loader color="blue" size="md" />
						</Center>
					</Overlay>
				</Box>
			))}
		</>
	);
};
