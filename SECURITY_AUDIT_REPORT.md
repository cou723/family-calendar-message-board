# セキュリティ監査レポート

**監査日**: 2025-07-03  
**対象**: 家族カレンダー掲示板アプリケーション  
**監査範囲**: 認証システム、セッション管理、CSRF対策

## 📋 エグゼクティブサマリー

Google OAuth 2.0を使用したフロントエンドオンリーの家族向けカレンダーアプリのセキュリティ監査を実施しました。主要なセキュリティ脆弱性として、トークンの安全でない保存とCSRF対策の不備を特定しました。ローンチ前の段階であり、家庭内ネットワークでの使用を想定した設計のため、セキュリティリスクは限定的ですが、将来的な改善が推奨されます。

## 🔍 監査対象ファイル

### 主要な認証関連ファイル
- `src/calendar/gapiAuth.ts` - メイン認証モジュール
- `src/calendar/AuthStatus.tsx` - 認証UIコンポーネント  
- `src/calendar/useGoogleCalendar.ts` - 認証フックの統合
- `src/google-calendar/config.ts` - API設定
- `src/google-calendar/api.ts` - APIクライアント（レガシー）

## 🔐 認証システムの概要

### 認証フロー
1. **初期化**: Google APIs JavaScript Client + Google Identity Services
2. **認証**: OAuth 2.0 Authorization Code Flow with PKCE
3. **スコープ**: `https://www.googleapis.com/auth/calendar.readonly` (読み取り専用)
4. **トークン管理**: ブラウザのlocalStorageに保存

## ⚠️ 特定された脆弱性

### 🚨 高リスク: トークンの安全でない保存

**脆弱性の詳細**:
```typescript
// gapiAuth.ts:168-174
localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.access_token);
localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
if (tokenResponse.refresh_token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenResponse.refresh_token);
}
```

**リスク**:
- **XSS攻撃による情報漏えい**: localStorageはJavaScriptから自由にアクセス可能
- **永続的な保存**: ブラウザを閉じてもトークンが残存
- **暗号化なし**: トークンが平文で保存され、開発者ツールから閲覧可能

**影響度**: セッションハイジャック、不正なカレンダーアクセス

### 🚨 中リスク: CSRF対策の不備

**脆弱性の詳細**:
- OAuth認証フローにstateパラメータによるCSRF保護が未実装
- リフレッシュトークンの自動更新時のセキュリティ検証が不十分

**リスク**:
- **CSRF攻撃**: 悪意のあるサイトからの認証要求の可能性
- **セッション固定攻撃**: 攻撃者が制御するセッションでの認証

**影響度**: 意図しない認証、権限昇格

### 🚨 中リスク: トークンの長期間有効性

**脆弱性の詳細**:
```typescript
// gapiAuth.ts:281-282  
// 5分前に期限切れとして扱う（余裕を持たせる）
return now >= (expirationTime - 5 * 60 * 1000);
```

**リスク**:
- リフレッシュトークンに明示的な有効期限なし
- 自動更新により実質的に無期限アクセス可能

**影響度**: 長期間の不正アクセス継続

### 🚨 低〜中リスク: 環境変数の管理

**脆弱性の詳細**:
```typescript
// config.ts:5-6
apiKey: import.meta.env.VITE_GOOGLE_API_KEY || "",
clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
```

**リスク**:
- フロントエンドビルドにGoogle Client IDが含まれる（仕様上避けられない）
- 不適切な設定によるAPI濫用の可能性

**影響度**: APIクォータ超過、不正利用

## 🛡️ 実装済みの良いセキュリティプラクティス

### ✅ 適切なスコープ制限
- 読み取り専用スコープ使用によりデータ改竄リスクを排除

### ✅ エラーハンドリング
- 認証失敗時のフォールバック機能実装
- 詳細なエラー分類とログ出力

### ✅ トークンの自動更新
- リフレッシュトークンによるシームレスな認証更新

## 📋 推奨される改善策

### 🔴 最優先（ローンチ前）

#### 1. トークン保存方法の改善
**推奨実装**:
```typescript
// セッションベース認証への移行
// または最低限でもトークンの暗号化
const encryptedToken = await crypto.subtle.encrypt(algorithm, key, tokenData);
sessionStorage.setItem('encrypted_token', encryptedToken);
```

#### 2. CSRF保護の実装
**推奨実装**:
```typescript
const state = crypto.getRandomValues(new Uint8Array(16));
sessionStorage.setItem('oauth_state', btoa(String.fromCharCode(...state)));

tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: SCOPES,
    state: btoa(String.fromCharCode(...state)),
    callback: (response) => {
        if (response.state !== sessionStorage.getItem('oauth_state')) {
            throw new Error('Invalid state parameter');
        }
        // 通常の処理...
    }
});
```

### 🟡 中優先（ローンチ後1-2週間）

#### 3. セッション管理の強化
- セッションタイムアウトの実装（推奨: 24時間）
- アイドル時間監視による自動ログアウト
- 定期的な再認証要求（推奨: 7日間）

#### 4. Google Cloud Console設定の強化
- 承認済みドメインの制限設定
- リファラー制限の適切な設定
- 不要なAPIキーの削除

### 🟢 低優先（将来的な改善）

#### 5. 監査ログの実装
- 認証イベントのログ記録
- 異常なアクセスパターンの検出と通知

#### 6. セキュリティヘッダーの追加
- Content Security Policy (CSP) の実装
- X-Frame-Options, X-Content-Type-Options等の設定

#### 7. アーキテクチャの見直し
- バックエンドサーバーの導入検討
- サーバーサイドでのトークン管理への移行

## 🏗️ アーキテクチャ上の制約と考慮事項

### 現在の設計による制約
- **フロントエンドオンリー**: 完全にセキュアなトークン管理は技術的に困難
- **ブラウザ制約**: localStorageやsessionStorageはXSS攻撃に脆弱
- **プライベートネットワーク前提**: 家庭内ネットワークでの使用想定

### 設計上の利点
- **シンプルな運用**: サーバー管理不要
- **コスト効率**: インフラ費用なし
- **家族利用特化**: 限定的なユーザーベースでリスク低減

## 📊 リスク評価マトリックス

| 脆弱性 | 影響度 | 発生確率 | 総合リスク | 対応優先度 |
|--------|--------|----------|------------|------------|
| トークンの安全でない保存 | 高 | 中 | 高 | 最優先 |
| CSRF対策不備 | 中 | 低 | 中 | 中優先 |
| トークン長期有効性 | 中 | 中 | 中 | 中優先 |
| 環境変数管理 | 低 | 低 | 低 | 低優先 |

## 🎯 実装推奨タイムライン

### フェーズ1（ローンチ前）
- [ ] 基本的なCSRF保護実装
- [ ] Google Cloud Console設定強化

### フェーズ2（ローンチ後1ヶ月）
- [ ] セッション管理改善
- [ ] トークン暗号化実装

### フェーズ3（長期的改善）
- [ ] 監査ログ実装
- [ ] バックエンド導入検討

## 💡 結論

現在のセキュリティリスクは家庭内ネットワークでの使用という前提条件下では許容範囲内ですが、将来的なセキュリティ強化は推奨されます。特にCSRF保護とトークン管理の改善は比較的簡単に実装でき、セキュリティ向上に大きく寄与します。

---

**監査実施者**: Claude Code  
**次回監査推奨時期**: ローンチ後3ヶ月以内  
**更新履歴**: 2025-07-03 初版作成