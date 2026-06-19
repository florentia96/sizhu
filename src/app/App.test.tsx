import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";
import { hrefFor, type Route } from "./routes";

vi.mock("../shared/layout/DetailLayout", () => ({
  DetailLayout: ({ id }: { id: string }) => <div data-testid="detail">detail:{id}</div>,
}));
vi.mock("../screens/BaziApp", () => ({
  BaziApp: ({ prefill }: { prefill?: { date?: string } }) => (
    <div data-testid="bazi">bazi:{prefill?.date ?? "none"}</div>
  ),
}));

function go(route: Route): void {
  window.history.pushState(null, "", hrefFor(route));
}

describe("App route switch", () => {
  beforeEach(() => {
    go({ name: "hub" });
  });
  afterEach(() => {
    go({ name: "hub" });
  });

  it("shows the hub at the root path", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
  });

  it("renders DetailLayout for a feature route", () => {
    go({ name: "feature", id: "phone" });
    render(<App />);
    expect(screen.getByTestId("detail")).toHaveTextContent("detail:phone");
  });

  it("renders BaziApp with params for /bazi", () => {
    go({ name: "bazi", params: { bd: "1990-05-12" } });
    render(<App />);
    expect(screen.getByTestId("bazi")).toHaveTextContent("bazi:1990-05-12");
  });

  it("renders the design system for /ds", () => {
    go({ name: "ds" });
    render(<App />);
    expect(screen.getByText(/Design System/)).toBeInTheDocument();
  });

  it("typing in the header search shows search results on the hub", () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/ค้นหาศาสตร์/);
    fireEvent.change(input, { target: { value: "เบอร์" } });
    expect(screen.getByText(/ผลการค้นหา/)).toBeInTheDocument();
  });

  it("clicking the logo returns to the hub and clears the query", () => {
    go({ name: "ds" });
    render(<App />);
    fireEvent.click(screen.getByText("卜"));
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
  });
});
