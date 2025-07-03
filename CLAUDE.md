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
- **API状態管理**: TanStack Query v5 (実装済み、キャッシュ機能付き)
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
- **型定義の統一化**: 同じ構造の型定義が複数ファイルに散らばることを防ぐため、共通の型は`types.ts`ファイルに集約し、各ファイルからimportして使用する
- **構造化されたファイル構成**: 複雑なコンポーネントは専用ディレクトリを作成し、子コンポーネントと適切にスコープを分離する
- **説明変数の適切な使用**: 意味のある説明変数は積極的に使用し、不要な単純代入は避ける
- **状態オブジェクトの適切な命名**: メインデータを基準とした命名を行い、抽象的な接尾語を避ける

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

## 実装済み機能

1. ~~プロジェクト初期セットアップ~~ ✅
2. ~~テスト環境セットアップ~~ ✅  
3. ~~Googleカレンダー API連携~~ ✅
4. ~~基本UI実装~~ ✅
5. ~~時間軸表示機能~~ ✅
6. ~~複数カレンダー対応~~ ✅
7. ~~TanStack Query実装（キャッシュ機能）~~ ✅
8. ~~レスポンシブ対応（タブレット最適化）~~ ✅
9. ~~自動更新機能~~ ✅

## 今後の実装予定

1. 最適化・追加テスト
2. エラーハンドリングの改善
3. オフライン対応
4. パフォーマンス最適化

## コーディングスタイル

### ディレクトリ構造

ディレクトリ構造はcomponentsやhooksなど機械的に分けるのではなく領域ごとに分けてください。

**推奨構造**:
```
src/
├── calendar/
│   ├── index.tsx                  # メインコンポーネント
│   ├── useCalendarState.ts        # カレンダー状態管理hooks
│   ├── types.ts                   # カレンダー関連の型定義（共通型含む）
│   ├── utils.ts                   # カレンダー関連のユーティリティ
│   ├── mockData.ts               # モックデータと関連ユーティリティ
│   ├── CalendarHeader.tsx        # ヘッダーコンポーネント
│   ├── TimeColumn.tsx            # 時間軸コンポーネント
│   ├── familyMemberColumn/       # 家族メンバー関連
│   │   ├── index.tsx            # 家族メンバーメインコンポーネント
│   │   └── EventDisplay.tsx     # イベント表示子コンポーネント
│   ├── TodayButton.tsx           # 今日ボタンコンポーネント
│   ├── LoadingIndicator.tsx      # ローディング表示コンポーネント
│   ├── settingsModal/           # 設定モーダル関連
│   │   ├── index.tsx            # 設定モーダルメインコンポーネント
│   │   └── TimeRangeInput.tsx   # 時間範囲入力子コンポーネント
│   └── useTouchNavigation.ts     # タッチナビゲーションhooks
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

### 構造化されたファイル構成の指針

複雑なコンポーネントや関連する子コンポーネントがある場合は、専用ディレクトリを作成して適切にスコープを分離します。

**適用基準**:
- コンポーネントが複数の子コンポーネントを持つ場合
- 子コンポーネントが親コンポーネント専用で他から参照されない場合
- 重複するロジックを子コンポーネントとして抽出できる場合

**構造化の例**:
```
src/calendar/settingsModal/
├── index.tsx            # メインコンポーネント（SettingsModal）
├── TimeRangeInput.tsx   # 専用子コンポーネント
└── types.ts            # 必要に応じてモーダル専用の型定義
```

**メリット**:
- 適切なスコープ分離（子コンポーネントが外部に公開されない）
- コードの重複排除と保守性向上
- テスト容易性の向上
- 機能の凝集度向上

### 説明変数の適切な使用指針

コードの可読性向上のため、説明変数は適切に使用し、不要な代入は避けます。

**✅ 使用すべき例**:
```typescript
// 計算結果に意味のある名前を付ける
const duration = event.endHour - event.startHour;
const height = duration * cellHeight;
const topPosition = (event.startHour - startHour) * cellHeight + headerHeight;

// 複雑な条件式を分かりやすくする
const isOverlapping = newEvent.startTime < existingEvent.endTime;
const isSameDay = format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');

// 長いプロパティアクセスを短縮し、意味を明確にする
const screenHeight = window.innerHeight;
const availableHeight = screenHeight - reservedHeight;
```

**❌ 避けるべき例**:
```typescript
// 単純な代入で意味が変わらない
const eventStartHour = event.startHour; // ❌ 不要
const userName = user.name;             // ❌ 不要

// 文字数も変わらず、意味も同じ
const id = item.id;                     // ❌ 不要
const title = data.title;               // ❌ 不要
```

**判断基準**:
- **計算や変換が含まれる** → 説明変数を使用
- **意味的に異なる概念を表現する** → 説明変数を使用  
- **単純なプロパティアクセスの別名** → 直接使用
- **文字数がほぼ同じで意味も同じ** → 直接使用

### 状態オブジェクトの適切な命名指針

状態をグループ化する際は、メインとなるデータを基準とした命名を行い、そのデータが「何のため」に使われるのかを明確にします。

**✅ 適切な命名例**:
```typescript
// メインデータを基準とした命名
currentDate: { date, isDateChanging }           // メイン: 現在の日付
swipe: { startX, setStartX }                    // 目的: スワイプ操作
cell: { startHour, endHour, cellHeight, headerHeight } // 目的: セルレンダリング
settingsModal: { isOpen, setIsOpen }           // 目的: 設定モーダル制御
settingsControl: { setStartHour, setEndHour }  // 目的: 設定値変更
actions: { goToPreviousDay, goToNextDay, goToToday } // 役割: アクション群
```

**❌ 避けるべき命名例**:
```typescript
// 抽象的で目的が不明確
dateState: { currentDate, isDateChanging }     // ❌ State接尾語は冗長
touchState: { startX, setStartX }              // ❌ 何のタッチか不明
layoutState: { startHour, endHour, ... }      // ❌ 何のレイアウトか不明
modalState: { isSettingsOpen, ... }           // ❌ どのモーダルか不明
```

**命名原則**:
1. **メインデータを基準にする**: オブジェクトの主要な値から命名
2. **目的・用途を明確にする**: そのデータが何のために使われるかを表現
3. **具体性を重視する**: `touch`より`swipe`、`layout`より`cell`
4. **冗長な接尾語を避ける**: `State`、`Data`などの汎用的な接尾語は除く
5. **データ重複を避ける**: 同じデータが複数のオブジェクトに含まれないよう設計

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