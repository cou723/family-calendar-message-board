import { createTheme, MantineProvider } from "@mantine/core";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { RequireAuth } from "./auth/RequireAuth";
import { SettingsProvider } from "./Calendar/contexts/SettingsContext";
import { CalendarPage } from "./pages/CalendarPage";
import { SettingsPage } from "./pages/SettingsPage";

const GOOGLE_CLIENT_ID =
	import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";

// 老眼対応のテーマ設定
const theme = createTheme({
	fontSizes: {
		xs: "1.5rem",
		sm: "1.725rem",
		md: "2rem",
		lg: "2.5rem",
		xl: "2.75rem",
	},
	headings: {
		sizes: {
			h1: { fontSize: "3.5rem" },
			h2: { fontSize: "3.25rem" },
			h3: { fontSize: "3rem" },
			h4: { fontSize: "2.75rem" },
			h5: { fontSize: "2.5rem" },
			h6: { fontSize: "2rem" },
		},
	},
	defaultRadius: "md",
	primaryColor: "blue",
});

function App() {
	return (
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<MantineProvider theme={theme}>
				<SettingsProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<LoginPage />} />
							<Route
								path="/"
								element={
									<RequireAuth>
										<CalendarPage />
									</RequireAuth>
								}
							/>
							<Route
								path="/settings"
								element={
									<RequireAuth>
										<SettingsPage />
									</RequireAuth>
								}
							/>
						</Routes>
					</BrowserRouter>
				</SettingsProvider>
			</MantineProvider>
		</GoogleOAuthProvider>
	);
}

export default App;
