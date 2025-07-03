# 家族カレンダー API サーバー (Deno Deploy)

Deno Deployを使用したセキュアな認証プロキシサーバー

## セットアップ

### 1. 環境変数設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して以下を設定：

- `GOOGLE_CLIENT_ID`: Google Cloud ConsoleのOAuth 2.0クライアントID
- `GOOGLE_CLIENT_SECRET`: Google Cloud ConsoleのOAuth 2.0クライアントシークレット
- `BASE_URL`: デプロイ先のURL（開発時は http://localhost:8000）

### 2. ローカル開発

```bash
deno task dev
```

### 3. Deno Deployへのデプロイ

1. [Deno Deploy](https://dash.deno.com/) でプロジェクト作成
2. GitHubリポジトリを連携
3. エントリーポイントを `deno-backend/main.ts` に設定
4. 環境変数を設定

## エンドポイント

### 認証
- `GET /api/auth/login` - Google OAuth認証開始
- `GET /api/auth/callback` - OAuth認証コールバック
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/status` - 認証状態確認

### カレンダー
- `GET /api/calendar/events?calendarId=xxx&timeMin=xxx&timeMax=xxx` - イベント取得
- `GET /api/calendar/list` - カレンダー一覧取得

### ヘルスチェック
- `GET /health` - サーバー状態確認

## セキュリティ機能

- ✅ OAuth 2.0 PKCE フロー
- ✅ CSRF保護 (state parameter)
- ✅ セッション管理 (httpOnly cookies)
- ✅ トークン自動更新
- ✅ セキュリティヘッダー
- ✅ CORS設定