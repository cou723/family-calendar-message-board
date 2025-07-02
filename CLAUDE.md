# 家族カレンダー掲示板

## プロジェクト概要

タブレット表示用の家族向けカレンダーアプリケーション。Googleカレンダーと連携し、4人分の1日の予定を見やすく表示します。

## 主要機能

### 基本機能
- Googleカレンダーからの予定取得・表示
- 4人分の予定を同時表示
- 1日の予定を時間軸で表示（1時間ごとのマス目形式）
- 横スクロールによる日付ナビゲーション（前日・翌日表示）

### UI/UX要件
- **アクセシビリティ重視**
  - 老眼対応のため大きな文字サイズ
  - 操作を最小限に抑制（自動更新・表示）
  - 1日の予定が必ず1画面内に表示
- **時間軸表示**
  - 1時間ごとのグリッド表示
  - 空き時間が視覚的に分かる設計
  - 予定の時間的な関係性が一目で理解可能

### 技術要件
- フロントエンドのみの実装
- Googleカレンダー API連携
- レスポンシブデザイン（タブレット最適化）
- 自動更新機能

## 画面設計

### メイン画面
```
┌─────────────────────────────────────────────────────────────┐
│ [←] 2024/07/01 (月) [→]                                    │
├─────────────────────────────────────────────────────────────┤
│     │ 人A    │ 人B    │ 人C    │ 人D    │                  │
├─────┼────────┼────────┼────────┼────────┤                  │
│ 8:00│ 会議   │        │ 運動   │        │                  │
│ 9:00│ 会議   │ 外出   │ 運動   │        │                  │
│10:00│        │ 外出   │        │ 買い物 │                  │
│11:00│        │ 外出   │        │ 買い物 │                  │
│12:00│ 昼食   │ 昼食   │ 昼食   │ 昼食   │                  │
│...  │        │        │        │        │                  │
└─────────────────────────────────────────────────────────────┘
```

## 開発方針

### フロントエンド技術スタック

#### 確定技術スタック
- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 5.x
- **パッケージマネージャー**: pnpm
- **Linter/Formatter**: Biome.js
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: React Aria（アクセシビリティ重視）
- **状態管理**: React Context API + useState
- **API状態管理**: TanStack Query v5
- **日付処理**: date-fns
- **API通信**: Native Fetch API
- **Google API**: gapi-script (公式TypeScript SDK)

#### 開発方針
- 型安全性を重視した実装
- 最小限のテストで品質保証
- エラーハンドリングの明確な定義
- 老眼対応・タブレット最適化のアクセシビリティ重視

### コーディング規約
- 型推論の積極的活用
- 型安全でない箇所の明確なドキュメント化
- 機能追加・変更時のドキュメント更新必須

## プロジェクト初期化での注意点

### TailwindCSS v4の設定について
- **重要**: TailwindCSS v4では従来の `npx tailwindcss init -p` コマンドは存在しない
- v4では設定ファイル不要でCSS-firstアプローチを採用
- 必要なパッケージ: `@tailwindcss/vite` と `tailwindcss` の両方
- CSSファイルに `@import "tailwindcss";` を追加
- Vite設定に `@tailwindcss/vite` プラグインを追加

### 動作確認済みコマンド
- `pnpm run lint`: Biome.jsでのコードチェック ✅
- `pnpm run lint:fix`: 自動修正 ✅
- `pnpm run typecheck`: TypeScript型チェック ✅
- `pnpm run build`: プロダクションビルド ✅
- `pnpm run dev`: 開発サーバー起動（http://localhost:5173/） ✅
- `pnpm run test`: Vitestでテスト実行（watchモード） ✅
- `pnpm run test:run`: Vitestでテスト実行（一回のみ） ✅
- `pnpm run test:ui`: Vitestテスト実行（UIモード） ✅

### テスト環境
- **テストフレームワーク**: Vitest 3.2.4
- **テスティングライブラリ**: React Testing Library 16.3.0
- **アサーションライブラリ**: @testing-library/jest-dom 6.6.3
- **ユーザーイベント**: @testing-library/user-event 14.6.1
- **テスト環境**: jsdom（ブラウザ環境シミュレート）

## 今後の実装予定

1. ~~プロジェクト初期セットアップ~~ ✅
2. ~~テスト環境セットアップ~~ ✅  
3. Googleカレンダー API連携
4. 基本UI実装
5. 時間軸表示機能
6. レスポンシブ対応
7. 自動更新機能
8. 最適化・追加テスト

## コーディングスタイル

### ディレクトリ構造

ディレクトリ構造はcomponentsやhooksなど機械的に分けるのではなく領域ごとに分けてください。

**推奨構造**:
```
src/
├── calendar/
│   ├── index.tsx                  # コンポーネント本体
│   ├── useCalendarData.ts         # カレンダー関連のhooks
│   ├── CalendarTypes.ts           # カレンダー関連の型定義
│   └── CalendarUtils.ts           # カレンダー関連のユーティリティ
├── family/
│   ├── FamilyMember.tsx          # 家族メンバーコンポーネント
│   ├── useFamilySettings.ts      # 家族設定のhooks
│   └── FamilyTypes.ts            # 家族関連の型定義
└── shared/
    ├── contexts/                 # 共通のContext
    ├── hooks/                    # 共通のhooks
    └── types/                    # 共通の型定義
```

**避けるべき構造**:
```
src/
├── components/           # 機能別ではなく技術別の分類
│   ├── CalendarGrid.tsx
│   └── FamilyMember.tsx
├── hooks/               # 機能別ではなく技術別の分類
│   ├── useCalendarData.ts
│   └── useFamilySettings.ts
└── types/               # 機能別ではなく技術別の分類
    ├── CalendarTypes.ts
    └── FamilyTypes.ts
```

### エラーハンドリング

**明確なエラー型定義**:
```typescript
// ✅ 良い例
export type CalendarError = 
  | { type: 'GOOGLE_API_ERROR'; message: string; code: number }
  | { type: 'NETWORK_ERROR'; message: string }
  | { type: 'PERMISSION_ERROR'; requiredScope: string };

export const useCalendarData = (): {
  data: CalendarEvent[] | null;
  error: CalendarError | null;
  loading: boolean;
} => {
  // エラー処理の実装
};
```

### テスト可能性の向上

**関数注入による依存関係の分離**: テストが困難な関数（fetchやDate操作など）は引数で受け取り、テスト時にモック関数を注入できるようにする。

```typescript
// ✅ 良い例 - 関数注入パターン
interface CalendarDataFetcher {
  fetchEvents: (calendarId: string, dateRange: DateRange) => Promise<CalendarEvent[]>;
  getCurrentDate: () => Date;
}

export const useCalendarData = (
  fetcher: CalendarDataFetcher = {
    fetchEvents: defaultFetchEvents,
    getCurrentDate: () => new Date()
  }
) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const loadEvents = async (calendarId: string) => {
    const dateRange = { start: fetcher.getCurrentDate(), /* ... */ };
    const data = await fetcher.fetchEvents(calendarId, dateRange);
    setEvents(data);
  };
  
  return { events, loadEvents };
};

// テスト例
test('カレンダーデータを正しく取得する', async () => {
  const mockFetcher: CalendarDataFetcher = {
    fetchEvents: jest.fn().mockResolvedValue([/* mock data */]),
    getCurrentDate: jest.fn().mockReturnValue(new Date('2024-01-01'))
  };
  
  const { result } = renderHook(() => useCalendarData(mockFetcher));
  // テスト実行...
});
```

**避けるべきパターン**:
```typescript
// ❌ 悪い例 - 直接依存でテストが困難
export const useCalendarData = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const loadEvents = async (calendarId: string) => {
    // fetch関数が直接埋め込まれており、テスト時にモックできない
    const response = await fetch(`/api/calendar/${calendarId}`);
    const data = await response.json();
    setEvents(data);
  };
  
  return { events, loadEvents };
};
```