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

// 安全なlocalStorageラッパー
export const SafeStorage = {
	getItem,
	setItem,
	removeItem,
};
