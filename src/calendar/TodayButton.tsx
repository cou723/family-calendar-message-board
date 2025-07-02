interface TodayButtonProps {
  goToToday: () => void;
}

export const TodayButton = ({ goToToday }: TodayButtonProps) => {
  return (
    <button
      onClick={goToToday}
      className="fixed bottom-6 right-6 w-14 h-14 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-2xl z-50 transition-all"
    >
      📅
    </button>
  );
};