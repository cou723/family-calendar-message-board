import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MockAuthClient } from "../MockAuthClient";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
	test("初期状態では認証されていない", () => {
		const mockAuthClient = new MockAuthClient({ authenticated: false });
		const { result } = renderHook(() =>
			useAuth({ authClient: mockAuthClient }),
		);

		expect(result.current.isAuthenticated).toBe(true); // useMockData || isAuthenticated
		expect(result.current.useMockData).toBe(true);
		expect(result.current.isAuthenticating).toBe(false);
	});

	test("認証が成功した場合の状態変化", async () => {
		const mockAuthClient = new MockAuthClient({ authenticated: true });
		const { result } = renderHook(() =>
			useAuth({ authClient: mockAuthClient }),
		);

		await waitFor(() => {
			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.useMockData).toBe(false);
			expect(result.current.authError).toBe(null);
		});
	});

	test("認証エラーが発生した場合", async () => {
		const mockAuthClient = new MockAuthClient({ shouldThrowError: true });
		const { result } = renderHook(() =>
			useAuth({ authClient: mockAuthClient }),
		);

		await waitFor(() => {
			expect(result.current.isAuthenticated).toBe(true); // useMockDataがtrueなので
			expect(result.current.useMockData).toBe(true);
			expect(result.current.authError).toContain(
				"認証状態の確認に失敗しました",
			);
		});
	});

	test("authenticate関数が正常に動作する", async () => {
		const mockAuthClient = new MockAuthClient({ authenticated: false });
		const { result } = renderHook(() =>
			useAuth({ authClient: mockAuthClient }),
		);

		const success = await result.current.authenticate();
		expect(success).toBe(true);
	});

	test("authenticate関数でエラーが発生する場合", async () => {
		const mockAuthClient = new MockAuthClient({ shouldThrowError: true });
		const { result } = renderHook(() =>
			useAuth({ authClient: mockAuthClient }),
		);

		const success = await result.current.authenticate();
		expect(success).toBe(false);
		expect(result.current.authError).toContain("認証エラー");
	});
});
