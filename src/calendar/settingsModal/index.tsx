import { TimeRangeInput } from "./TimeRangeInput";

interface SettingsModalProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (value: boolean) => void;
  startHour: number;
  setStartHour: (value: number) => void;
  endHour: number;
  setEndHour: (value: number) => void;
}

export const SettingsModal = ({
  isSettingsOpen,
  setIsSettingsOpen,
  startHour,
  setStartHour,
  endHour,
  setEndHour,
}: SettingsModalProps) => {
  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsSettingsOpen(false)}>
      <div className="bg-white rounded-lg p-6 w-80 max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-center">表示設定</h2>
        
        <div className="space-y-4">
          <TimeRangeInput
            label="開始時間"
            value={startHour}
            onChange={setStartHour}
          />

          <TimeRangeInput
            label="終了時間"
            value={endHour}
            onChange={setEndHour}
          />

          <div className="text-sm text-gray-600 text-center">
            表示時間: {endHour - startHour + 1}時間
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};