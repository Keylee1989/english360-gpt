import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("App", () => {
  it("renders the home page", () => {
    renderWithRouter(<App />);
    expect(screen.getByText("English360")).toBeInTheDocument();
  });

  it("displays the project description", () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/你的AI英语教练/)).toBeInTheDocument();
  });

  it("shows learning mission", () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/今日学习任务/)).toBeInTheDocument();
  });
});
