# 家族カレンダー掲示板

タブレット表示用の家族向けカレンダーアプリケーション。フロントエンドオンリーの構成でGoogleカレンダー連携を実現。

## 🚀 デプロイ構成

### フロントエンド（Vercel）
- **URL**: `https://family-calendar-message-board.vercel.app`
- **技術**: Vite + React + TypeScript + Mantine UI
- **自動デプロイ**: main ブランチプッシュ時

## 🔐 セキュリティ機能

- ✅ OAuth 2.0認証フローによる安全な認証
- ✅ CSRF保護 (state parameter)
- ✅ トークンの暗号化保存（AES-GCM 256bit）
- ✅ XSS攻撃によるトークン窃取防止
- ✅ セキュリティヘッダー設定

## 🛠️ 開発環境セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/your-username/family-calendar-message-board.git
cd family-calendar-message-board
```

### 2. 依存関係インストール

```bash
pnpm install
```

### 3. 環境変数設定

Google Cloud Consoleで取得したOAuth認証情報を設定:

```bash
# .env.localファイルを作成
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. 開発サーバー起動

```bash
pnpm run dev
```

## 📦 デプロイ手順

### Vercel連携

1. **Vercel設定**
   - [Vercel](https://vercel.com/)でGitHubリポジトリをインポート
   - プロジェクト名を `family-calendar-message-board` に設定

2. **環境変数設定**
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **自動デプロイ**
   - main ブランチへのプッシュで自動デプロイ

## 🏗️ アーキテクチャ

```
┌─────────────────────┐    ┌─────────────────┐
│   Vercel            │    │  Google APIs    │
│   (Frontend)        │◄──►│  (Calendar API) │
│                     │    │                 │
│ - React + Vite      │    │ - Calendar API  │
│ - Mantine UI        │    │ - 読み取り専用   │
│ - TypeScript        │    │                 │
│ - 暗号化トークン保存 │    │                 │
└─────────────────────┘    └─────────────────┘
```

## 💻 開発コマンド

```bash
pnpm run dev          # 開発サーバー起動
pnpm run build        # プロダクションビルド
pnpm run preview      # ビルド結果のプレビュー
pnpm run typecheck    # TypeScript型チェック
pnpm run lint         # コードリント
pnpm run lint:fix     # リント自動修正
pnpm run test         # テスト実行
pnpm run test:ui      # テストUIモード
```

## 🔧 設定ファイル

- `vercel.json` - Vercelデプロイ設定
- `vite.config.ts` - Viteビルド設定
- `biome.json` - コード品質設定
- `tsconfig.json` - TypeScript設定

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
- **トークンの暗号化保存**: AES-GCM 256bitでlocalStorageに暗号化保存
- **CSRF攻撃防止**: stateパラメータによる保護
- **XSS攻撃対策**: 暗号化によるトークン窃取防止
- **セキュリティヘッダー設定**: Vercelでのセキュリティヘッダー

### 監査レポート
- `SECURITY_AUDIT_REPORT.md` - セキュリティ監査結果
- **高リスク脆弱性を完全解決**: 家族向けアプリケーションとして安全な運用レベルを達成

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request