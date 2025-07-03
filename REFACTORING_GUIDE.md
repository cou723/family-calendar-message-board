# リファクタリングガイド

このドキュメントでは、家族カレンダープロジェクトでの大規模リファクタリングの実践的な手順とノウハウを記載しています。

## アンチパターンの検出

### バケツリレーパターンの検出と解決法

#### 検出方法

```typescript
// ❌ バケツリレーパターン（避けるべき）
export const ParentComponent = () => {
  const { data, loading, error } = useCustomHook();
  const { settings, updateSettings } = useSettings();
  const { navigation, goToNext, goToPrev } = useNavigation();
  
  return (
    <ChildComponent 
      data={data} 
      loading={loading}
      error={error}
      settings={settings}
      updateSettings={updateSettings}
      navigation={navigation}
      goToNext={goToNext}
      goToPrev={goToPrev}
    />
  );
};

// ✅ 直接参照パターン（推奨）
export const ChildComponent = () => {
  const { data, loading, error } = useCustomHook();
  const { settings, updateSettings } = useSettings();
  const { navigation, goToNext, goToPrev } = useNavigation();
  
  return <div>{/* 実際の表示 */}</div>;
};
```

#### 判断基準

- propsとして渡しているデータが、親コンポーネントで直接使用されていない
- 子コンポーネントが特定のhookに強く依存している
- インポートチェーンが深くなっている
- 1つのコンポーネントが5個以上のhookを呼び出している

### 悪い構造の早期発見指標

#### 警告サイン

- **ファイルサイズ**: 単一ファイルが150行超
- **インポート数**: 10個超のimport文
- **props数**: コンポーネントが8個超のpropsを受け取る
- **hook呼び出し**: 親コンポーネントで5個超のhook使用

#### 定期チェック項目

- [ ] `index.tsx`が薄いコンポーネントになっているか
- [ ] 各hookが単一責任を持っているか  
- [ ] ドメイン境界が明確に分離されているか
- [ ] 型定義が適切に共有・分離されているか

## 大規模リファクタリングの実践手順

### Phase 1: 現状分析

1. **肥大化したファイルの特定**
   ```bash
   # ファイルサイズチェック
   find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -nr | head -20
   
   # 複雑な依存関係の可視化
   grep -r "import" src --include="*.ts" --include="*.tsx" | wc -l
   ```

2. **依存関係の可視化**
   - どのコンポーネントが何を使用しているかマッピング
   - 循環依存の検出
   - 未使用のimportの特定

3. **バケツリレーパターンの特定**
   - props drilling が発生している箇所の洗い出し
   - 親コンポーネントで取得したデータの使用状況確認

### Phase 2: ドメイン分割計画

1. **責任に基づくドメイン領域の定義**
   ```
   auth/     - 認証・ログイン関連
   data/     - API通信・データ取得関連
   display/  - UI表示・レンダリング関連
   settings/ - 設定・構成管理関連
   ```

2. **ファイル移動計画の策定**
   - 各ファイルがどのドメインに属するか分類
   - 移動順序の決定（依存関係順）
   - インポートパス変更の影響範囲確認

3. **共通要素の特定**
   - 複数ドメインで使用される要素を`shared/`に配置

### Phase 3: 段階的実行

#### Step 1: 型定義ファイルの統一化

```bash
# 重複した型定義の検出
grep -r "interface\|type" src --include="*.ts" | grep -E "(CalendarEvent|FamilyMember)" | sort
```

重複した型定義を統一し、`shared/types.ts`に集約

#### Step 2: hooksの責任分離

```typescript
// Before: 肥大化したhook
export const useGoogleCalendar = () => {
  // 認証ロジック
  // データ取得ロジック
  // 設定管理ロジック
  // 180行以上...
};

// After: 責任分離
export const useAuth = () => { /* 認証のみ */ };
export const useCalendarEvents = () => { /* データ取得のみ */ };
export const useFamilyCalendars = () => { /* 設定管理のみ */ };
export const useGoogleCalendar = () => {
  // 薄い統合層
  const auth = useAuth();
  const events = useCalendarEvents();
  const calendars = useFamilyCalendars();
  return { ...auth, ...events, ...calendars };
};
```

#### Step 3: コンポーネント特化hooksの移動

```bash
# コンポーネント特化hooksの特定
grep -r "export.*use" src --include="*.ts" | grep -v shared
```

単一コンポーネントでのみ使用されるhooksを該当コンポーネントディレクトリに移動

#### Step 4: ドメインディレクトリの作成と移動

```bash
# ドメインディレクトリの作成
mkdir -p src/calendar/{auth,data,display,settings,components,shared}

# ファイル移動（依存関係順）
# 1. 共通型定義
# 2. 認証関連
# 3. データ取得関連
# 4. UI表示関連
# 5. 設定関連
```

#### Step 5: インポートパス一括修正

```typescript
// 修正前
import { useAuth } from './useAuth';
import { CalendarEvent } from './types';

// 修正後
import { useAuth } from '../auth/useAuth';
import { CalendarEvent } from '../shared/types';
```

### Phase 4: 検証

#### 自動検証スクリプト

```bash
# 型安全性確認
pnpm run typecheck

# コーディング規約確認  
pnpm run lint

# 動作確認
pnpm run test

# ビルド確認
pnpm run build
```

#### 手動検証項目

- [ ] 全ての機能が正常に動作する
- [ ] パフォーマンスの劣化がない
- [ ] 新しいディレクトリ構造が一貫している
- [ ] 未使用のファイルやimportがない

## トラブルシューティング

### よくある問題と解決法

#### 1. 循環依存エラー

```typescript
// 問題: A → B → A の循環依存
// 解決: 共通部分をsharedに抽出

// Before
// A.ts: import B from './B'
// B.ts: import A from './A'

// After  
// shared/common.ts: 共通の型や関数
// A.ts: import common from '../shared/common'
// B.ts: import common from '../shared/common'
```

#### 2. インポートパスエラー

```bash
# 一括置換でパスを修正
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "\./useAuth"|from "../auth/useAuth"|g'
```

#### 3. 型エラー

```typescript
// 型定義が見つからない場合は、適切なインポートパスを確認
import type { CalendarEvent } from '../shared/types';
```

## ベストプラクティス

### リファクタリング時の注意点

1. **小さな単位で実行**: 一度に大きな変更をしない
2. **テストの実行**: 各ステップでテストを実行して回帰を防ぐ
3. **コミット履歴**: 意味のある単位でコミットを作成
4. **型安全性の維持**: TypeScriptエラーが発生しないよう注意

### 継続的な改善

1. **定期的なレビュー**: 月1回程度の構造チェック
2. **メトリクス監視**: ファイルサイズ、複雑度の追跡
3. **チーム共有**: リファクタリングの知見をドキュメント化

## 参考資料

- [CLAUDE.md](./CLAUDE.md) - プロジェクトの基本設計指針
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Hook Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)