export interface IAuthClient {
	login(): Promise<void>;
	logout(): Promise<void>;
	checkAuthStatus(): Promise<boolean>;
}
