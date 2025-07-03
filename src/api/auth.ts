const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class AuthClient {
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
			const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				return data.authenticated === true;
			}
			return false;
		} catch (error) {
			console.error("Auth status check failed:", error);
			return false;
		}
	}
}
