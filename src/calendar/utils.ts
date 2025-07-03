// 時間を30分対応でフォーマット
export const formatTime = (hour: number) => {
	const h = Math.floor(hour);
	const m = (hour % 1) * 60;
	return `${h}:${m.toString().padStart(2, "0")}`;
};
