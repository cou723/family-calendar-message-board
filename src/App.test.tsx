import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
	it("renders login page correctly", () => {
		render(<App />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"家族カレンダー",
		);
	});

	it("displays login button", () => {
		render(<App />);
		const loginButton = screen.getByRole("button", {
			name: /Googleカレンダーでログイン/i,
		});
		expect(loginButton).toBeInTheDocument();
	});

	it("displays app description", () => {
		render(<App />);
		expect(
			screen.getByText(
				/Googleアカウントでログインしてご家族の予定を表示します/,
			),
		).toBeInTheDocument();
	});
});
