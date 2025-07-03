import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { handleRequest } from "./routes/index.ts";

// .envファイルを読み込み（プロダクション環境では.envファイルは存在しないためエラーを無視）
try {
  await load({ 
    export: true,
    allowEmptyValues: true,
    examplePath: null  // .env.exampleのチェックを無効化
  });
} catch (error) {
  console.log("ℹ️ .envファイルが見つかりません（プロダクション環境では正常）");
}

const PORT = parseInt(Deno.env.get("PORT") || "8000");

console.log(`🚀 家族カレンダーAPI サーバー起動 - Port: ${PORT}`);
console.log(`📅 Environment: ${Deno.env.get("DENO_ENV") || "development"}`);
console.log(
	`🔐 Google Client ID: ${Deno.env.get("GOOGLE_CLIENT_ID") ? "設定済み" : "未設定"}`,
);
console.log(
	`🔑 Google Client Secret: ${Deno.env.get("GOOGLE_CLIENT_SECRET") ? "設定済み" : "未設定"}`,
);

Deno.serve({
	port: PORT,
}, handleRequest);
