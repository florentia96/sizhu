import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";

// Real DetailLayout + BaziApp are rendered here (no mocks) — this is render-level
// proof that the routing → form → engine → SectionRenderer seam works end-to-end.

function setHash(hash: string): void {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

describe("App integration — real screens", () => {
  beforeEach(() => {
    window.location.hash = "";
  });
  afterEach(() => {
    window.location.hash = "";
  });

  it("default hash renders the Hub with the 5 group headers", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ชื่อมงคล" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "โหราศาสตร์" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ศาสตร์จีน" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ดวงประจำวัน & ความเชื่อไทย" })).toBeInTheDocument();
  });

  it("phone feature: fill input, submit, and a result appears", () => {
    render(<App />);
    setHash("#/f/phone");

    // The phone feature has a single tel input.
    const input = document.getElementById("mf-0") as HTMLInputElement;
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: "0812345678" } });

    fireEvent.click(screen.getByText("เปิดดูผลทำนาย"));

    // VerdictCard for 0812345678 → score 78, grade A ("ดีมาก").
    expect(screen.getByText("ผลวิเคราะห์")).toBeInTheDocument();
    expect(screen.getAllByText(/ดีมาก/).length).toBeGreaterThan(0);
    expect(screen.getByText("78")).toBeInTheDocument();
  });

  it("#/bazi renders the full BaZi screen", () => {
    render(<App />);
    setHash("#/bazi");
    expect(screen.getByText("เปิดดวงปาจื้อ")).toBeInTheDocument();
  });
});
