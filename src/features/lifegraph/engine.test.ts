import { describe, it, expect } from "vitest";
import { lifeEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

const VALS = ["1990-01-15", "14:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", "2026-06-19"];

describe("lifegraph engine", () => {
  it("schema-valid + deterministic with injected now", () => {
    const r = lifeEngine.build(VALS);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(lifeEngine.build(VALS)).toEqual(lifeEngine.build(VALS));
  });

  it("different now → may differ, but each is internally stable", () => {
    const a = lifeEngine.build(VALS);
    const b = lifeEngine.build(["1990-01-15", "14:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", "2030-06-19"]);
    expect(() => ReportSchema.parse(b)).not.toThrow();
    expect(a).toEqual(lifeEngine.build(VALS));
  });

  it("reference vector: verdict grade reports a personal year", () => {
    const r = lifeEngine.build(VALS);
    const verdict = r.find((s) => s.kind === "verdict");
    expect(verdict).toBeTruthy();
    if (verdict && verdict.kind === "verdict") expect(verdict.grade).toMatch(/ปีส่วนตัว \d/);
  });

  it("contains a transit blocks section and a 5-year grid", () => {
    const r = lifeEngine.build(VALS);
    expect(r.some((s) => s.kind === "blocks")).toBe(true);
    const grid = r.find((s) => s.kind === "grid");
    expect(grid).toBeTruthy();
    if (grid && grid.kind === "grid") expect(grid.cells.length).toBeGreaterThanOrEqual(5);
  });

  it("missing now → note (engine never reads Date.now)", () => {
    expect(lifeEngine.build(["1990-01-15", "14:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", ""])).toEqual([
      { kind: "note", text: "กรอกวันเกิด เวลาเกิด เมืองเกิด และวันที่ที่ต้องการดู ให้ครบ แล้วลองใหม่" },
    ]);
  });
});
