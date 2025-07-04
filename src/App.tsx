import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { RequireAuth } from "./auth/RequireAuth";
import { CalendarPage } from "./pages/CalendarPage";

const GOOGLE_CLIENT_ID =
	import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";

function App() {
	return (
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
				</Routes>
			</BrowserRouter>
		</GoogleOAuthProvider>
	);
}

export default App;
