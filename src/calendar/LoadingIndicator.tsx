interface LoadingIndicatorProps {
  isDateChanging: boolean;
}

export const LoadingIndicator = ({ isDateChanging }: LoadingIndicatorProps) => {
  if (!isDateChanging) return null;

  return (
    <div className="fixed bottom-6 left-6 bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg z-50">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};