import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../src/app/App";

function mockReducedMotion() {
  window.matchMedia = ((q: string) => ({
    matches: q.includes("reduce"),
    media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => { mockReducedMotion(); });
afterEach(() => { cleanup(); window.location.hash = ""; });

describe("App shell: #/bazi route", () => {
  it("#/bazi (no params) → BaziApp in paper mode (form visible)", () => {
    window.location.hash = "#/bazi";
    render(<App />);
    expect(screen.getByText("กรอกวัน-เวลาเกิด")).toBeTruthy();
  });

  it("#/bazi?bd=1996-04-03&bt=23:58 → prefill autocast → result (form skipped)", () => {
    window.location.hash = "#/bazi?bd=1996-04-03&bt=23:58";
    render(<App />);
    expect(screen.queryByText("กรอกวัน-เวลาเกิด")).toBeNull();
    expect(screen.getByText(/03\/04\/1996/)).toBeTruthy();
  });
});
