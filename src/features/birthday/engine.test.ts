import { describe, it, expect } from "vitest";
import { birthdayReport } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("birthday engine", () => {
  const ref = () => birthdayReport(1990, 5, 15, 2026);

  it("reference vector: 1990-05-15 nowYear 2026", () => {
    const secs = ref();
    const prose = secs.find((s) => s.kind === "prose");
    expect(prose && prose.kind === "prose" && prose.title).toContain("อังคาร");
    // There are several grids - pick the one with a "rasi" (zodiac) cell (the personal chart summary)
    const grid = secs.find(
      (s) => s.kind === "grid" && s.cells.some((c) => c.name === "ราศี"),
    );
    if (grid && grid.kind === "grid") {
      const rasiCell = grid.cells.find((c) => c.name === "ราศี");
      expect(rasiCell?.value).toBe("ราศีพฤษภ");
      const lp = grid.cells.find((c) => c.name.includes("เลขชีวิต"));
      expect(lp?.value).toBe("3");
      const py = grid.cells.find((c) => c.name.includes("ปีส่วนตัว"));
      expect(py?.value).toBe("เลข 3");
    } else {
      throw new Error("summary grid section missing");
    }
  });

  it("includes day-lord personality, lucky + กาลกิณี swatches, and life-path guide", () => {
    const secs = ref();
    // In-depth personality of the day lord (strengths/cautions/career)
    const persona = secs.find(
      (s) => s.kind === "prose" && s.title.includes("บุคลิกของคนเกิดวัน"),
    );
    expect(persona).toBeDefined();
    // Two swatch sets: auspicious colors + kalakini colors
    const swatches = secs.filter((s) => s.kind === "swatches");
    expect(swatches.length).toBe(2);
    expect(swatches.some((s) => s.title.includes("กาลกิณี"))).toBe(true);
    // The life number has a "way of living" paragraph
    const lp = secs.find(
      (s) => s.kind === "prose" && s.title.includes("เลขชีวิต"),
    );
    expect(
      lp &&
        lp.kind === "prose" &&
        lp.paras.some((p) => p.h === "แนวทางใช้ชีวิต"),
    ).toBe(true);
  });

  it("uses polite-neutral tone (no ครับ/ค่ะ particles)", () => {
    const text = JSON.stringify(ref());
    expect(text).not.toMatch(/ครับ/);
    expect(text).not.toMatch(/ค่ะ/);
    expect(text).not.toMatch(/คะ/);
  });

  it("is deterministic for fixed nowYear", () => {
    expect(JSON.stringify(ref())).toBe(JSON.stringify(ref()));
  });

  it("satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(ref())).not.toThrow();
  });

  it("normalizes Buddhist year (>2300 => -543)", () => {
    const ce = birthdayReport(1990, 5, 15, 2026);
    const be = birthdayReport(2533, 5, 15, 2026);
    expect(JSON.stringify(be)).toBe(JSON.stringify(ce));
  });

  it("invalid input returns a schema-valid note, never throws", () => {
    const out = birthdayReport(NaN, NaN, NaN, 2026);
    expect(out[0].kind).toBe("note");
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
});
