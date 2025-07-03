interface TimeRangeInputProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
}

export const TimeRangeInput = ({
	label,
	value,
	onChange,
}: TimeRangeInputProps) => {
	return (
		<div>
			<label
				htmlFor={`time-range-${label}`}
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				{label}: {value}:00
			</label>
			<input
				id={`time-range-${label}`}
				type="range"
				min="0"
				max="23"
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full"
			/>
		</div>
	);
};
