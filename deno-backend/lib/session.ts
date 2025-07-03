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
	const existing = await getSession(sessionId);
	if (!existing) throw new Error("Session not found");

	const updated = { ...existing, ...updates };
	await kv.set(["sessions", sessionId], updated, { expireIn: 86400000 });
}

export async function deleteSession(sessionId: string): Promise<void> {
	await kv.delete(["sessions", sessionId]);
}
