import { createContext, type ReactNode, useContext } from "react";
import { useGoogleAuth } from "../auth/useGoogleAuth";

// useGoogleAuthの戻り値型を取得
type AuthContextType = ReturnType<typeof useGoogleAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	// 認証状態をアプリケーション全体で共有
	const authState = useGoogleAuth();

	return (
		<AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
