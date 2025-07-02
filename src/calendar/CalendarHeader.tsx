import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface CalendarHeaderProps {
  currentDate: Date;
  isDateChanging: boolean;
  setIsSettingsOpen: (value: boolean) => void;
}

export const CalendarHeader = ({
  currentDate,
  isDateChanging,
  setIsSettingsOpen,
}: CalendarHeaderProps) => {
  return (
    <div className="bg-white shadow-sm p-4 flex-shrink-0 relative">
      <div className={`text-center px-6 py-4 rounded-lg transition-all duration-300 ${
        isDateChanging 
          ? "bg-green-100 scale-105" 
          : "bg-blue-50"
      }`}>
        <h1 className={`text-2xl font-bold ${
          isDateChanging ? "text-green-800" : "text-blue-800"
        }`}>
          {format(currentDate, "yyyy/M/d", { locale: ja })} ({format(currentDate, "E", { locale: ja })})
        </h1>
      </div>
      
      {/* 設定ボタン */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
      >
        <span className="text-lg">⚙️</span>
      </button>
    </div>
  );
};