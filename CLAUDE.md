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

### 重要な開発ルール
- **pre-commit hookの回避は絶対禁止**: `--no-verify`フラグなどでpre-commit hookを回避してはいけません
- コミット前に必ずlintとtypecheckが通ることを確認してください
- エラーがある場合は修正してからコミットしてください

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

### フォルダ構造設計

フォルダ構造はコンポーネントとその関連ファイルで整理してください。

#### ファイル配置の判断基準

ファイルの配置は以下の判断フローに従って決定します：

1. **単一コンポーネント専用か？** → YES: コンポーネントフォルダ内に配置
2. **特定の責任領域か？** → YES: 該当責任領域フォルダに配置  
3. **複数領域で共有か？** → YES: shared/に配置

#### フォルダの分類例

- `auth/` - 認証・ログイン関連
- `data/` - API通信・データ取得関連
- `display/` - UI表示・レンダリング関連
- `settings/` - 設定・構成管理関連
- `components/` - 子コンポーネント群の整理
- `shared/` - 複数領域で使用される共通要素

#### 現在の推奨構造

```
src/Calendar/                     # Calendarコンポーネント
├── index.tsx                     # export const Calendar = ... (18行)
├── components/                   # 子コンポーネント群
│   ├── CalendarGrid/            # CalendarGridコンポーネント
│   │   ├── index.tsx            # export const CalendarGrid = ...
│   │   └── useCellLayout.ts     # コンポーネント専用hooks
│   ├── TouchNavigationWrapper/  # TouchNavigationWrapperコンポーネント
│   │   ├── index.tsx            # export const TouchNavigationWrapper = ...
│   │   ├── useSwipeState.ts     # コンポーネント専用hooks
│   │   └── useTouchNavigation.ts # コンポーネント専用hooks
│   ├── CalendarHeader.tsx       # 単一ファイルコンポーネント
│   ├── TodayButton.tsx          # 単一ファイルコンポーネント
│   ├── SettingsModal.tsx        # 単一ファイルコンポーネント
│   └── AuthStatus.tsx           # 単一ファイルコンポーネント
├── auth/                        # 認証関連
│   ├── useAuth.ts
│   ├── IAuthClient.ts
│   ├── MockAuthClient.ts
│   └── __tests__/
│       └── useAuth.test.tsx
├── data/                        # データ取得関連
│   ├── queries/
│   │   ├── useCalendarEvents.ts
│   │   └── useCalendarList.ts
│   ├── useCalendarEvents.ts
│   ├── useCalendarList.ts
│   └── useFamilyCalendars.ts
├── display/                     # UI表示関連
│   ├── TimeColumn.tsx
│   ├── EventsLoadingPlaceholder.tsx
│   ├── FamilyMemberColumn/      # FamilyMemberColumnコンポーネント
│   │   ├── index.tsx            # export const FamilyMemberColumn = ...
│   │   └── EventDisplay.tsx
│   └── utils/
│       └── cellBackgroundUtils.ts
├── settings/                    # 設定関連
│   └── SettingsModal/           # SettingsModalコンポーネント
│       ├── index.tsx            # export const SettingsModal = ...
│       ├── TimeRangeInput.tsx
│       ├── CalendarSelector.tsx
│       ├── CalendarSettingsTab.tsx
│       └── MultipleCalendarSelector.tsx
└── shared/                      # 共通要素
    ├── types.ts                 # 共通型定義
    ├── utils.ts
    ├── mockData.ts
    ├── useGoogleCalendar.ts     # 統合hooks
    ├── useDateNavigation.ts
    └── useSettings.ts
```

#### コンポーネント専用hooksの配置指針

hooksの配置は以下の基準で決定します：

**配置基準**:
- **単一コンポーネント専用**: `ComponentName/useSpecificHook.ts`
- **関連領域内共通**: `relatedArea/useSharedHook.ts`
- **全体共通**: `shared/useGlobalHook.ts`

**実装例**:
```typescript
// ❌ バケツリレーパターン（避けるべき）
export const ParentComponent = () => {
  const { data, loading } = useCustomHook();
  return <ChildComponent data={data} loading={loading} />;
};

// ✅ 直接参照パターン（推奨）
export const ChildComponent = () => {
  const { data, loading } = useCustomHook();
  return <div>{data}</div>;
};
```

**判断基準**:
- propsとして渡しているデータが、親コンポーネントで直接使用されていない
- 子コンポーネントが特定のhookに強く依存している
- インポートチェーンが深くなっている

#### 大規模リファクタリングについて

肥大化したコンポーネントやhooksの分割、適切なフォルダ構造への移行などの大規模リファクタリングを行う際は、[REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)を参照してください。このガイドには具体的な手順、アンチパターンの検出方法、段階的な実行プロセスが記載されています。

**避けるべき構造**:
```
src/
├── components/           # 技術的分類（コンポーネント単位の整理なし）
│   ├── CalendarGrid.tsx
│   └── FamilyMember.tsx
├── hooks/               # 技術的分類（コンポーネント単位の整理なし）
│   ├── useCalendarData.ts
│   └── useFamilySettings.ts
└── types/               # 技術的分類（コンポーネント単位の整理なし）
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

### ファイル・ディレクトリ命名規則

#### ファイル命名規則
- **コンポーネント**: PascalCase (`CalendarGrid.tsx`)
- **hooks**: camelCase with use prefix (`useCalendarData.ts`)
- **型定義**: PascalCase (`CalendarEvent`)
- **その他**: camelCase (`utils.ts`, `mockData.ts`)

#### ディレクトリ命名規則

**基本概念**: フォルダはコンポーネントフォルダ（PascalCase）かその他フォルダ（camelCase）のいずれかです。

##### コンポーネントフォルダ (PascalCase)
- 直下の`index.tsx`でコンポーネントをexport
- 例: `Calendar/`, `CalendarGrid/`, `FamilyMemberColumn/`

##### その他フォルダ (camelCase)  
- 関連ファイルの整理・分類
- 例: `Calendar/auth/`, `Calendar/settings/`, `Calendar/components/`

**実例**:
```
src/
├── Calendar/              # コンポーネントフォルダ (Calendarコンポーネント)
│   ├── index.tsx         # export const Calendar = ...
│   ├── auth/             # その他フォルダ (認証関連)
│   ├── settings/         # その他フォルダ (設定関連) 
│   ├── components/       # その他フォルダ (子コンポーネント群)
│   │   ├── CalendarGrid/ # コンポーネントフォルダ (CalendarGridコンポーネント)
│   │   │   └── index.tsx # export const CalendarGrid = ...
│   │   ├── FamilyMemberColumn/ # コンポーネントフォルダ (FamilyMemberColumnコンポーネント)
│   │   │   └── index.tsx # export const FamilyMemberColumn = ...
│   │   └── ...
│   ├── shared/          # その他フォルダ (共通要素)
│   └── display/         # その他フォルダ (UI表示関連)
└── api/                 # その他フォルダ
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

**依存関係注入による分離**: テストが困難な外部依存（API呼び出し、ブラウザAPI等）はインターフェースで抽象化し、テスト時にモック実装を注入できるようにする。

```typescript
// ✅ 良い例 - 依存関係注入パターン
interface IAuthClient {
  login(): Promise<void>;
  logout(): Promise<void>;
  checkAuthStatus(): Promise<boolean>;
}

export const useAuth = (options: { authClient?: IAuthClient } = {}) => {
  const authClient = options.authClient || new AuthClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkAuthStatus = async () => {
    const authenticated = await authClient.checkAuthStatus();
    setIsAuthenticated(authenticated);
  };
  
  return { isAuthenticated, checkAuthStatus };
};

// テスト例
test('認証状態を正しく取得する', async () => {
  const mockAuthClient: IAuthClient = {
    login: vi.fn(),
    logout: vi.fn(),
    checkAuthStatus: vi.fn().mockResolvedValue(true)
  };
  
  const { result } = renderHook(() => useAuth({ authClient: mockAuthClient }));
  // テスト実行...
});
```

**実装済みテスタビリティ改善**:
- `useAuth`: AuthClientをインターフェース化し、MockAuthClientでテスト可能
- `useGoogleCalendar`: 認証依存関係を注入可能に設計
- テスト用モック: `MockAuthClient`でエラーケースや状態変化をテスト可能

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