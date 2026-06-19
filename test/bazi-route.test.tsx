import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../src/app/App";
import { hrefFor, type Route } from "../src/app/routes";

function mockReducedMotion() {
  window.matchMedia = ((q: string) => ({
    matches: q.includes("reduce"),
    media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function go(route: Route): void {
  window.history.pushState(null, "", hrefFor(route));
}

beforeEach(() => { mockReducedMotion(); });
afterEach(() => { cleanup(); go({ name: "hub" }); });

describe("App shell: /bazi route", () => {
  it("/bazi (no params) → BaziApp in paper mode (form visible)", () => {
    go({ name: "bazi" });
    render(<App />);
    expect(screen.getByText("กรอกวัน-เวลาเกิด")).toBeTruthy();
  });

  it("/bazi?bd=1996-04-03&bt=23:58 → prefill autocast → result (form skipped)", () => {
    go({ name: "bazi", params: { bd: "1996-04-03", bt: "23:58" } });
    render(<App />);
    expect(screen.queryByText("กรอกวัน-เวลาเกิด")).toBeNull();
    expect(screen.getByText(/03\/04\/1996/)).toBeTruthy();
  });
});
