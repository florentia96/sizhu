import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { Section } from "../sections/types";
import { summarize, buildShareText } from "./buildShareText";
import { ShareBar } from "./ShareBar";

describe("summarize", () => {
  it("uses verdict as the primary line", () => {
    const secs: Section[] = [
      { kind: "verdict", score: 88, grade: "A", gradeLabel: "เบอร์มงคลมาก", summary: "คู่เลขส่งเสริมการเงิน" },
    ];
    expect(summarize(secs)[0]).toContain("เบอร์มงคลมาก (A)");
  });

  it("falls back to grid cells when no verdict", () => {
    const secs: Section[] = [
      { kind: "grid", title: "สรุป", glyph: "吉", cells: [{ name: "ราศี", value: "เมษ" }] },
    ];
    expect(summarize(secs)[0]).toContain("ราศี เมษ");
  });

  it("falls back to note text when nothing else", () => {
    const secs: Section[] = [{ kind: "note", text: "กรอกข้อมูลให้ครบ" }];
    expect(summarize(secs)).toEqual(["กรอกข้อมูลให้ครบ"]);
  });

  it("buildShareText prefixes the feature name and brand", () => {
    const secs: Section[] = [{ kind: "note", text: "x" }];
    expect(buildShareText("ทำนายฝัน", secs).split("\n")[0]).toBe("ทำนายฝัน · MooDee");
  });
});

describe("ShareBar", () => {
  const secs: Section[] = [
    { kind: "verdict", score: 88, grade: "A", gradeLabel: "ดีมาก", summary: "ส่งเสริมการเงิน" },
  ];

  it("renders the share + copy actions", () => {
    render(<ShareBar featureName="เบอร์มงคล" sections={secs} url="https://x/#/f/phone" />);
    expect(screen.getByRole("button", { name: /แชร์ผล/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /คัดลอกลิงก์/ })).toBeInTheDocument();
  });

  it("copies the link to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<ShareBar featureName="เบอร์มงคล" sections={secs} url="https://x/#/f/phone" />);
    fireEvent.click(screen.getByRole("button", { name: /คัดลอกลิงก์/ }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("https://x/#/f/phone"));
  });
});
