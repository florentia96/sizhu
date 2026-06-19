import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionRenderer } from "./SectionRenderer";
import type { Section } from "./types";

describe("SectionRenderer", () => {
  it("renders a verdict section and shows its score", () => {
    const sections: Section[] = [
      { kind: "verdict", score: 86, grade: "A", gradeLabel: "ดีมาก", summary: "สรุปผล", accent: "#6cc18a" },
    ];
    render(<SectionRenderer sections={sections} accent="#6cc18a" />);
    expect(screen.getByText("86")).toBeInTheDocument();
  });

  it("renders a note section and shows its text", () => {
    const sections: Section[] = [{ kind: "note", text: "กรอกข้อมูลให้ครบ" }];
    render(<SectionRenderer sections={sections} accent="#6cc18a" />);
    expect(screen.getByText("กรอกข้อมูลให้ครบ")).toBeInTheDocument();
  });

  it("renders multiple sections of different kinds together", () => {
    const sections: Section[] = [
      { kind: "verdict", score: 70, grade: "B", gradeLabel: "ดี", summary: "s" },
      { kind: "rows", title: "คู่เลข", glyph: "號", items: [{ n: "56", title: "ทรัพย์", meaning: "เงินดี", fg: "#6cc18a" }] },
      { kind: "prose", title: "ภาพรวม", glyph: "文", paras: [{ t: "เนื้อความ" }] },
      { kind: "note", text: "หมายเหตุท้าย" },
    ];
    render(<SectionRenderer sections={sections} accent="#7da6d8" />);
    expect(screen.getByText("70")).toBeInTheDocument();
    expect(screen.getByText("คู่เลข")).toBeInTheDocument();
    expect(screen.getByText("เนื้อความ")).toBeInTheDocument();
    expect(screen.getByText("หมายเหตุท้าย")).toBeInTheDocument();
  });

  it("passes the prop accent to cards that lack a section accent (grid value colored by accent)", () => {
    const sections: Section[] = [
      { kind: "grid", title: "t", glyph: "x", cells: [{ name: "n", value: "v" }] },
    ];
    render(<SectionRenderer sections={sections} accent="#e0584b" />);
    expect(screen.getByText("v")).toHaveStyle({ color: "#e0584b" });
  });
});
