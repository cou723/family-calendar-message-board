import type { IAuthClient } from "../Calendar/auth/IAuthClient";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class AuthClient implements IAuthClient {
	async login(): Promise<void> {
		window.location.href = `${API_BASE_URL}/api/auth/login`;
	}

	async logout(): Promise<void> {
		const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
			method: "POST",
			credentials: "include",
		});

		if (response.ok) {
			window.location.reload();
		} else {
			throw new Error("Logout failed");
		}
	}

	async checkAuthStatus(): Promise<boolean> {
		try {
			console.log("🔍 Checking auth status...");
			console.log("- API URL:", `${API_BASE_URL}/api/auth/status`);
			console.log("- Current cookies:", document.cookie);

			const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
				credentials: "include",
			});

			console.log("- Response status:", response.status);
			console.log(
				"- Response headers:",
				Object.fromEntries(response.headers.entries()),
			);

			if (response.ok) {
				const data = await response.json();
				console.log("- Response data:", data);
				return data.authenticated === true;
			}
			console.log("❌ Auth status check failed: Response not OK");
			return false;
		} catch (error) {
			console.error("Auth status check failed:", error);
			return false;
		}
	}
}
