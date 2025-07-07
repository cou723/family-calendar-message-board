// 軽量なResult型実装
export type Result<T, E = Error> =
	| { success: true; data: T }
	| { success: false; error: E };

export const Ok = <T>(data: T): Result<T, never> => ({
	success: true,
	data,
});

export const Err = <E>(error: E): Result<never, E> => ({
	success: false,
	error,
});

/**
 * localStorageから値を安全に取得
 */
export function getItem(key: string): Result<string | null, string> {
	try {
		const item = localStorage.getItem(key);
		return Ok(item);
	} catch (error) {
		return Err(
			`localStorage.getItem failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * localStorageに値を安全に保存
 */
export function setItem(key: string, value: string): Result<void, string> {
	try {
		localStorage.setItem(key, value);
		return Ok(undefined);
	} catch (error) {
		return Err(
			`localStorage.setItem failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * localStorageから値を安全に削除
 */
export function removeItem(key: string): Result<void, string> {
	try {
		localStorage.removeItem(key);
		return Ok(undefined);
	} catch (error) {
		return Err(
			`localStorage.removeItem failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * 任意の同期関数を安全に実行
 */
export function safeSync<T>(
	fn: () => T,
	errorMessage?: string,
): Result<T, string> {
	try {
		const result = fn();
		return Ok(result);
	} catch (error) {
		const message = errorMessage || "Synchronous operation failed";
		return Err(
			`${message}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * 任意の非同期関数を安全に実行
 */
export async function safeAsync<T>(
	fn: () => Promise<T>,
	errorMessage?: string,
): Promise<Result<T, string>> {
	try {
		const result = await fn();
		return Ok(result);
	} catch (error) {
		const message = errorMessage || "Asynchronous operation failed";
		return Err(
			`${message}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * 安全なfetchラッパー
 */
export async function safeFetch(
	url: string,
	options?: RequestInit,
): Promise<Result<Response, string>> {
	return safeAsync(() => fetch(url, options), `Fetch request to ${url} failed`);
}

/**
 * 安全なJSON parseラッパー
 */
export function safeJsonParse<T = unknown>(
	jsonString: string,
): Result<T, string> {
	return safeSync(() => JSON.parse(jsonString) as T, "JSON parse failed");
}

/**
 * 安全なJWT decodeラッパー
 */
export function safeJwtDecode<T = unknown>(token: string): Result<T, string> {
	return safeSync(() => {
		// jwt-decode ライブラリを使用する場合の実装例
		// 実際にはjwtDecodeをimportして使用
		const base64Url = token.split(".")[1];
		if (!base64Url) {
			throw new Error("Invalid JWT token format");
		}
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
				.join(""),
		);
		return JSON.parse(jsonPayload) as T;
	}, "JWT decode failed");
}

/**
 * Web Crypto APIを使用した暗号化キーの生成
 */
async function generateEncryptionKey(): Promise<CryptoKey> {
	return await crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256,
		},
		true,
		["encrypt", "decrypt"],
	);
}

/**
 * キーをlocalStorageから取得または新規生成
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
	const keyResult = getItem("encryption-key");

	if (keyResult.success && keyResult.data) {
		try {
			const keyData = JSON.parse(keyResult.data);
			return await crypto.subtle.importKey(
				"jwk",
				keyData,
				{ name: "AES-GCM" },
				true,
				["encrypt", "decrypt"],
			);
		} catch (error) {
			console.warn("Failed to import stored key, generating new one:", error);
		}
	}

	// 新しいキーを生成して保存
	const key = await generateEncryptionKey();
	const exportedKey = await crypto.subtle.exportKey("jwk", key);
	setItem("encryption-key", JSON.stringify(exportedKey));

	return key;
}

/**
 * データを暗号化
 */
async function encryptData(data: string): Promise<Result<string, string>> {
	try {
		const key = await getOrCreateEncryptionKey();
		const encoder = new TextEncoder();
		const dataBuffer = encoder.encode(data);

		const iv = crypto.getRandomValues(new Uint8Array(12));
		const encryptedBuffer = await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv },
			key,
			dataBuffer,
		);

		// IVと暗号化データを結合してbase64エンコード
		const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
		combined.set(iv);
		combined.set(new Uint8Array(encryptedBuffer), iv.length);

		return Ok(btoa(String.fromCharCode(...combined)));
	} catch (error) {
		return Err(
			`Encryption failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * データを復号化
 */
async function decryptData(
	encryptedData: string,
): Promise<Result<string, string>> {
	try {
		const key = await getOrCreateEncryptionKey();
		const combined = new Uint8Array(
			atob(encryptedData)
				.split("")
				.map((char) => char.charCodeAt(0)),
		);

		const iv = combined.slice(0, 12);
		const encrypted = combined.slice(12);

		const decryptedBuffer = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv },
			key,
			encrypted,
		);

		const decoder = new TextDecoder();
		return Ok(decoder.decode(decryptedBuffer));
	} catch (error) {
		return Err(
			`Decryption failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * 暗号化してlocalStorageに保存
 */
export async function setItemEncrypted(
	key: string,
	value: string,
): Promise<Result<void, string>> {
	const encryptResult = await encryptData(value);
	if (!encryptResult.success) {
		return encryptResult;
	}

	return setItem(key, encryptResult.data);
}

/**
 * localStorageから取得して復号化
 */
export async function getItemEncrypted(
	key: string,
): Promise<Result<string | null, string>> {
	const getResult = getItem(key);
	if (!getResult.success) {
		return getResult;
	}

	if (!getResult.data) {
		return Ok(null);
	}

	const decryptResult = await decryptData(getResult.data);
	if (!decryptResult.success) {
		return decryptResult;
	}

	return Ok(decryptResult.data);
}

// 安全なlocalStorageラッパー
export const SafeStorage = {
	getItem,
	setItem,
	removeItem,
	setItemEncrypted,
	getItemEncrypted,
};
