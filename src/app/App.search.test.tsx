import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";
import { hrefFor, type Route } from "./routes";

vi.mock("../shared/layout/DetailLayout", () => ({
  DetailLayout: ({ id }: { id: string }) => <div data-testid="detail">detail:{id}</div>,
}));
vi.mock("../screens/BaziApp", () => ({
  BaziApp: () => <div data-testid="bazi">bazi</div>,
}));

function go(route: Route): void {
  window.history.pushState(null, "", hrefFor(route));
}

describe("App header-search parity", () => {
  beforeEach(() => {
    go({ name: "hub" });
  });
  afterEach(() => {
    go({ name: "hub" });
  });

  it("typing a query while on the design system jumps back to the hub results", () => {
    go({ name: "ds" });
    render(<App />);
    expect(screen.getByText(/Design System/)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/ค้นหาศาสตร์/);
    fireEvent.change(input, { target: { value: "ฝัน" } });
    expect(screen.queryByText(/Design System/)).not.toBeInTheDocument();
    expect(screen.getByText(/ผลการค้นหา/)).toBeInTheDocument();
  });

  it("clearing the query while on the hub stays on the hub", () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/ค้นหาศาสตร์/);
    fireEvent.change(input, { target: { value: "ฝัน" } });
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
  });
});
