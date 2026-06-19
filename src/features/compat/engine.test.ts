import { describe, it, expect } from "vitest";
import { compatEngine, scoreDeterministic, reduceSingle } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("compat engine — deterministic score (port of moodee-lib 871-902)", () => {
  it("reduceSingle collapses to 1..9", () => {
    expect(reduceSingle(28)).toBe(1);
    expect(reduceSingle(9)).toBe(9);
    expect(reduceSingle(10)).toBe(1);
  });

  it("schema-valid + deterministic (dates only)", () => {
    const v = ["1990-01-15", "1992-07-20"];
    const r = compatEngine.build(v);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(compatEngine.build(v)).toEqual(r);
  });

  it("reference vector A: same element (both Capricorn=ดิน), lp diff>1", () => {
    const a = { y: 1990, m: 1, d: 15 };
    const b = { y: 1991, m: 1, d: 20 };
    const res = scoreDeterministic(a, b);
    expect(res.score).toBeGreaterThanOrEqual(77);
    expect(res.score).toBeLessThanOrEqual(83);
  });

  it("reference vector B: harmonious elements (ไฟ×ลม) gives +18", () => {
    const a = { y: 1990, m: 4, d: 20 };
    const b = { y: 1990, m: 6, d: 20 };
    const res = scoreDeterministic(a, b);
    expect(res.score).toBeGreaterThanOrEqual(83);
  });

  it("score is clamped to [40,96]", () => {
    const res = scoreDeterministic({ y: 1990, m: 4, d: 20 }, { y: 1990, m: 6, d: 18 });
    expect(res.score).toBeLessThanOrEqual(96);
    expect(res.score).toBeGreaterThanOrEqual(40);
  });

  it("output is a compat section + grid + prose + note", () => {
    const r = compatEngine.build(["1990-01-15", "1992-07-20"]);
    expect(r[0].kind).toBe("compat");
    expect(r.some((s) => s.kind === "grid")).toBe(true);
    expect(r.some((s) => s.kind === "prose")).toBe(true);
    expect(r[r.length - 1].kind).toBe("note");
  });

  it("missing a date → note", () => {
    expect(compatEngine.build([""])).toEqual([
      { kind: "note", text: "กรอกวันเกิดของทั้งสองฝ่าย แล้วลองใหม่" },
    ]);
  });

  it("does NOT add synastry block when birth time/city incomplete", () => {
    const r = compatEngine.build(["1990-01-15", "1992-07-20"]);
    const blocks = r.filter((s) => s.kind === "blocks");
    expect(blocks.length).toBe(0);
  });
});
