import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Section } from "../sections/types";
import { ResultHero } from "./ResultHero";

describe("ResultHero", () => {
  it("shows the feature name and the headline drawn from the result", () => {
    const secs: Section[] = [
      { kind: "verdict", score: 88, grade: "A", gradeLabel: "ดีมาก", summary: "การเงินรุ่ง" },
    ];
    render(<ResultHero featureName="เบอร์มงคล" glyph="號" sections={secs} accent="#6cc18a" />);
    expect(screen.getByRole("heading", { name: "เบอร์มงคล" })).toBeInTheDocument();
    expect(screen.getByText(/ดีมาก/)).toBeInTheDocument();
  });
});
