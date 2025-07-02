interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const LoadingSpinner = ({ 
	size = "md", 
	className = "" 
}: LoadingSpinnerProps) => {
	const sizeClasses = {
		sm: "w-6 h-6",
		md: "w-12 h-12", 
		lg: "w-16 h-16"
	};

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<div
				className={`
					${sizeClasses[size]} 
					border-4 border-blue-200 border-t-blue-600 
					rounded-full animate-spin
				`}
				role="status"
				aria-label="読み込み中"
			>
				<span className="sr-only">読み込み中...</span>
			</div>
		</div>
	);
};