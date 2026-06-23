import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";
import { hrefFor, type Route } from "./routes";

// Real FeatureFlow + BaziApp are rendered here (no mocks) - this is render-level
// proof that the routing -> form -> casting -> engine -> SectionRenderer seam works end-to-end.

function go(route: Route): void {
  window.history.pushState(null, "", hrefFor(route));
}

function navigate(route: Route): void {
  act(() => {
    window.history.pushState(null, "", hrefFor(route));
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

describe("App integration — real screens", () => {
  beforeEach(() => {
    localStorage.clear();
    go({ name: "hub" });
  });
  afterEach(() => {
    go({ name: "hub" });
  });

  it("default path renders the Hub with the 5 group headers", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ชื่อมงคล" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "โหราศาสตร์" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ศาสตร์จีน" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ดวงประจำวัน & ความเชื่อไทย" })).toBeInTheDocument();
  });

  it("phone feature: fill input, casting, then a result appears", () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      navigate({ name: "feature", id: "phone" });

      // The phone feature has a single tel input (no birth data needed).
      const input = document.getElementById("mf-0") as HTMLInputElement;
      expect(input).toBeTruthy();
      fireEvent.change(input, { target: { value: "0812345678" } });

      fireEvent.click(screen.getByText("ดูผลทำนาย"));

      // The casting ceremony plays first -> advance time to reach the result page
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // VerdictCard for 0812345678 -> score 78, grade A (label "very good").
      expect(screen.getByText("ผลวิเคราะห์")).toBeInTheDocument();
      expect(screen.getAllByText(/ดีมาก/).length).toBeGreaterThan(0);
      expect(screen.getByText("78")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("/bazi renders the full BaZi screen", () => {
    render(<App />);
    navigate({ name: "bazi" });
    expect(screen.getByText("เปิดดวงปาจื้อ")).toBeInTheDocument();
  });
});
