import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
	it("renders Vite + React heading", () => {
		render(<App />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Vite + React");
	});

	it("increments count when button is clicked", async () => {
		const user = userEvent.setup();
		render(<App />);

		const button = screen.getByRole("button", { name: /count is/i });
		expect(button).toHaveTextContent("count is 0");

		await user.click(button);
		expect(button).toHaveTextContent("count is 1");

		await user.click(button);
		expect(button).toHaveTextContent("count is 2");
	});

	it("displays correct links", () => {
		render(<App />);

		const viteLink = screen.getByRole("link", { name: /vite logo/i });
		const reactLink = screen.getByRole("link", { name: /react logo/i });

		expect(viteLink).toHaveAttribute("href", "https://vite.dev");
		expect(reactLink).toHaveAttribute("href", "https://react.dev");
	});
});