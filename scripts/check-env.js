#!/usr/bin/env node

/**
 * Vercelデプロイ時の環境変数チェックスクリプト
 * 必要な環境変数が設定されているかを確認する
 */

const requiredEnvVars = [
	// 現在このアプリケーションではビルド時に必要な環境変数はない
	// Google認証はクライアントサイドで行われるため
];

const optionalEnvVars = [
	"VITE_GOOGLE_CLIENT_ID", // Google OAuth2 Client ID (将来的に使用予定)
];

console.log("🔍 環境変数をチェック中...");

let hasError = false;

// 必須環境変数のチェック
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		console.error(`❌ 必須環境変数が設定されていません: ${envVar}`);
		hasError = true;
	} else {
		console.log(`✅ ${envVar}: 設定済み`);
	}
}

// オプション環境変数の確認
for (const envVar of optionalEnvVars) {
	if (process.env[envVar]) {
		console.log(`✅ ${envVar}: 設定済み (オプション)`);
	} else {
		console.log(`ℹ️  ${envVar}: 未設定 (オプション)`);
	}
}

if (hasError) {
	console.error("❌ 環境変数の設定に問題があります。デプロイを中止します。");
	process.exit(1);
} else {
	console.log("✅ 環境変数チェック完了！");
	process.exit(0);
}
