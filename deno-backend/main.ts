import { handleRequest } from "./routes/index.ts";

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
	handler: handleRequest,
});
