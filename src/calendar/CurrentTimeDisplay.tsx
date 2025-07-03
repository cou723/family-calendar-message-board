import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const CurrentTimeDisplay = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		// 1秒ごとに現在時刻を更新
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed top-4 right-4 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 shadow-lg z-40">
			<div className="text-center">
				<div className="text-lg font-bold text-gray-800">
					{format(currentTime, "HH:mm:ss")}
				</div>
				<div className="text-sm text-gray-600">
					{format(currentTime, "M月d日(E)", { locale: ja })}
				</div>
			</div>
		</div>
	);
};