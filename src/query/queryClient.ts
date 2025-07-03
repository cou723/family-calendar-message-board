import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5分間はフレッシュ
			gcTime: 10 * 60 * 1000, // 10分間はキャッシュ保持
			retry: 1, // 1回リトライ
			refetchOnWindowFocus: false, // ウィンドウフォーカス時の再フェッチを無効
		},
	},
});
