import { Select } from "@mantine/core";

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
	const options = Array.from({ length: max - min + 1 }, (_, i) => {
		const hour = min + i;
		return {
			value: hour.toString(),
			label: `${hour}:00`,
		};
	});

	return (
		<Select
			label={label}
			value={value.toString()}
			onChange={(val) => onChange(Number(val))}
			data={options}
			size="md"
			withAsterisk={false}
		/>
	);
};
