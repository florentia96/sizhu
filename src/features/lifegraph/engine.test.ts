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

  it("unknown city → note, not a silent Bangkok chart (regression: H6)", () => {
    const r = lifeEngine.build(["1990-01-15", "14:30", "เมืองที่ไม่มีจริง", "ภาพรวมปีนี้", "2026-06-19"]);
    expect(r.some((s) => s.kind === "note")).toBe(true);
    expect(r.some((s) => s.kind === "verdict")).toBe(false);
  });

  it("scope (vals[3]) is read and filters transits (regression: was ignored)", () => {
    const love = lifeEngine.build(["1985-07-20", "08:30", "กรุงเทพมหานคร", "เน้นความรัก", "2026-06-19"]);
    const all = lifeEngine.build(["1985-07-20", "08:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", "2026-06-19"]);
    const verdict = (r: typeof love) => JSON.stringify(r.find((s) => s.kind === "verdict"));
    expect(verdict(love)).toContain("เน้นความรัก");
    expect(verdict(all)).not.toContain("เน้นความรัก");
    const blocks = love.find((s) => s.kind === "blocks");
    if (blocks && blocks.kind === "blocks") {
      for (const it of blocks.items) {
        expect(/ศุกร์|จันทร์|อังคาร/.test(it.title)).toBe(true);
      }
    }
  });
});
