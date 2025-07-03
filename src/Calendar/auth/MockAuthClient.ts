import type { IAuthClient } from "./IAuthClient";

export class MockAuthClient implements IAuthClient {
	private isAuthenticated = false;
	private shouldThrowError = false;

	constructor(
		options: { authenticated?: boolean; shouldThrowError?: boolean } = {},
	) {
		this.isAuthenticated = options.authenticated ?? false;
		this.shouldThrowError = options.shouldThrowError ?? false;
	}

	async login(): Promise<void> {
		if (this.shouldThrowError) {
			throw new Error("Mock login error");
		}
		this.isAuthenticated = true;
	}

	async logout(): Promise<void> {
		if (this.shouldThrowError) {
			throw new Error("Mock logout error");
		}
		this.isAuthenticated = false;
	}

	async checkAuthStatus(): Promise<boolean> {
		if (this.shouldThrowError) {
			throw new Error("Mock auth status check error");
		}
		return this.isAuthenticated;
	}

	// テスト用のヘルパーメソッド
	setAuthenticated(authenticated: boolean): void {
		this.isAuthenticated = authenticated;
	}

	setShouldThrowError(shouldThrow: boolean): void {
		this.shouldThrowError = shouldThrow;
	}
}
