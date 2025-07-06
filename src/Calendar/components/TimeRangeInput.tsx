interface TimeRangeInputProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
}

export const TimeRangeInput = ({
	label,
	value,
	onChange,
	min = 0,
	max = 23,
}: TimeRangeInputProps) => {
	const id = `time-range-${label.replace(/\s+/g, "-").toLowerCase()}`;

	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			<select
				id={id}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			>
				{Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
					(hour) => (
						<option key={hour} value={hour}>
							{hour}:00
						</option>
					),
				)}
			</select>
		</div>
	);
};
