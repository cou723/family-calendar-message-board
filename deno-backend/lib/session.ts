import type { Session } from "../types/index.ts";

const kv = await Deno.openKv();

export async function createSession(data: Partial<Session>): Promise<string> {
	const sessionId = crypto.randomUUID();
	const session: Session = {
		...data,
		authenticated: false,
		createdAt: Date.now(),
	};

	await kv.set(["sessions", sessionId], session, { expireIn: 86400000 }); // 24時間
	return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
	if (!sessionId) return null;

	const result = await kv.get(["sessions", sessionId]);
	return result.value as Session | null;
}

export async function updateSession(
	sessionId: string,
	updates: Partial<Session>,
): Promise<void> {
	console.log("🔧 Session update - ID:", sessionId);
	console.log("🔧 Session update - Updates:", updates);
	
	const existing = await getSession(sessionId);
	if (!existing) {
		console.error("❌ Session not found for update:", sessionId);
		throw new Error("Session not found");
	}
	
	console.log("🔧 Session update - Existing:", existing);

	const updated = { ...existing, ...updates };
	console.log("🔧 Session update - Final data:", updated);
	
	await kv.set(["sessions", sessionId], updated, { expireIn: 86400000 });
	console.log("✅ Session successfully saved to KV store");
}

export async function deleteSession(sessionId: string): Promise<void> {
	await kv.delete(["sessions", sessionId]);
}
