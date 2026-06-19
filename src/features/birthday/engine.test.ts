import { describe, it, expect } from "vitest";
import { birthdayReport } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("birthday engine", () => {
  const ref = () => birthdayReport(1990, 5, 15, 2026);

  it("reference vector: 1990-05-15 nowYear 2026", () => {
    const secs = ref();
    const prose = secs.find((s) => s.kind === "prose");
    expect(prose && prose.kind === "prose" && prose.title).toContain("อังคาร");
    const grid = secs.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const rasiCell = grid.cells.find((c) => c.name === "ราศี");
      expect(rasiCell?.value).toBe("ราศีพฤษภ");
      const lp = grid.cells.find((c) => c.name.includes("Life Path"));
      expect(lp?.value).toBe("3");
      const py = grid.cells.find((c) => c.name.includes("ปีส่วนตัว"));
      expect(py?.value).toBe("เลข 3");
    } else {
      throw new Error("grid section missing");
    }
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
