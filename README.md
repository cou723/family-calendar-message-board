# 家族カレンダー掲示板

タブレット表示用の家族向けカレンダーアプリケーション。セキュアなサーバーサイド認証とGoogleカレンダー連携を特徴とする。

## 🚀 デプロイ構成

### フロントエンド（Vercel）
- **URL**: `https://family-calendar-message-board.vercel.app`
- **技術**: Vite + React + TypeScript + TailwindCSS
- **自動デプロイ**: main ブランチプッシュ時

### バックエンド（Deno Deploy）
- **URL**: `https://family-calendar-api.deno.dev`
- **技術**: Deno + TypeScript
- **役割**: 認証プロキシ + セッション管理

## 🔐 セキュリティ機能

- ✅ OAuth 2.0 PKCE フローによる安全な認証
- ✅ httpOnlyクッキーによるセッション管理
- ✅ CSRF保護 (state parameter)
- ✅ XSS攻撃からの完全保護
- ✅ セッションタイムアウト（24時間）
- ✅ セキュリティヘッダー設定

## 🛠️ 開発環境セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/your-username/family-calendar-message-board.git
cd family-calendar-message-board
```

### 2. フロントエンド開発

```bash
# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env
# .envファイルを編集してAPIサーバーURLを設定

# 開発サーバー起動
pnpm run dev
```

### 3. バックエンド開発

```bash
cd deno-backend

# 環境変数設定
cp .env.example .env
# .envファイルにGoogle OAuth認証情報を設定

# 開発サーバー起動
deno task dev
```

## 📦 デプロイ手順

### フロントエンド（Vercel）

1. **Vercel連携**
   - [Vercel](https://vercel.com/)でGitHubリポジトリをインポート
   - プロジェクト名を `family-calendar-message-board` に設定
   - カスタムドメイン設定で `family-calendar-message-board.vercel.app` を使用

2. **環境変数設定**
   ```
   VITE_API_BASE_URL=https://family-calendar-api.deno.dev
   ```

3. **自動デプロイ**
   - main ブランチへのプッシュで自動デプロイ

### バックエンド（Deno Deploy）

1. **Deno Deploy設定**
   - [Deno Deploy](https://dash.deno.com/)でプロジェクト作成
   - プロジェクト名: `family-calendar-api`
   - GitHubリポジトリ連携
   - エントリーポイント: `deno-backend/main.ts`

2. **環境変数設定**
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   BASE_URL=https://family-calendar-api.deno.dev
   DENO_ENV=production
   ```

3. **Google Cloud Console設定**
   - OAuth 2.0 クライアントの承認済みリダイレクトURIに追加:
     ```
     https://family-calendar-api.deno.dev/api/auth/callback
     ```

## 🏗️ アーキテクチャ

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│   Vercel            │    │  Deno Deploy        │    │  Google APIs    │
│   (Frontend)        │◄──►│  (Auth Proxy)       │◄──►│  (Calendar API) │
│                     │    │                     │    │                 │
│ - React + Vite      │    │ - OAuth 2.0 PKCE    │    │ - Calendar API  │
│ - TailwindCSS       │    │ - Session管理        │    │ - 読み取り専用   │
│ - TypeScript        │    │ - CSRF保護          │    │                 │
└─────────────────────┘    └─────────────────────┘    └─────────────────┘
```

## 💻 開発コマンド

### フロントエンド
```bash
pnpm run dev          # 開発サーバー起動
pnpm run build        # プロダクションビルド
pnpm run preview      # ビルド結果のプレビュー
pnpm run typecheck    # TypeScript型チェック
pnpm run lint         # コードリント
pnpm run lint:fix     # リント自動修正
pnpm run test         # テスト実行
```

### バックエンド
```bash
deno task dev         # 開発サーバー起動
deno task start       # プロダクションサーバー起動
```

## 🔧 設定ファイル

- `vercel.json` - Vercelデプロイ設定
- `deno-backend/deno.json` - Deno設定
- `.env.example` - 環境変数テンプレート
- `.env.production` - プロダクション環境設定

## 📱 機能

### 基本機能
- Googleカレンダーからの予定取得・表示
- 4人分の予定を同時表示
- 1日の予定を時間軸で表示（1時間ごとのマス目形式）
- 横スクロールによる日付ナビゲーション
- **設定モーダル**: カレンダーID・表示時間帯・家族メンバー名の変更可能

### UI/UX特徴
- **アクセシビリティ重視**: 老眼対応の大きな文字サイズ
- **現在時刻ハイライト**: 現在の時間セルが黄色で強調表示
- **時間区切り**: 偶数時間・3の倍数時間で背景色を変更
- **自動更新**: 1分ごとの現在時刻更新
- **永続化設定**: ローカルストレージに家族設定を保存

## 🔒 セキュリティ対策

### 実装済み対策
- トークンのサーバーサイド管理
- httpOnlyクッキーによるセッション保護
- CSRF攻撃防止
- XSS攻撃対策
- セキュリティヘッダー設定

### 監査レポート
- `SECURITY_AUDIT_REPORT.md` - セキュリティ監査結果
- 家族向けアプリケーションとして十分なセキュリティレベルを達成

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request