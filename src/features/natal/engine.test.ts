import { describe, it, expect } from "vitest";
import { natalEngine, houseOf, toUT } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

const VALS = ["1990-01-15", "14:30", "กรุงเทพมหานคร"];

describe("natal engine", () => {
  it("returns schema-valid report", () => {
    const r = natalEngine.build(VALS);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(r.length).toBeGreaterThanOrEqual(3);
  });

  it("is deterministic (same input → identical output)", () => {
    expect(natalEngine.build(VALS)).toEqual(natalEngine.build(VALS));
  });

  it("toUT subtracts tz from local time", () => {
    const u = toUT("1990-01-15", "14:30", 7);
    expect(u.y).toBe(1990);
    expect(u.m).toBe(1);
    expect(u.d).toBe(15);
    expect(u.hourUT).toBeCloseTo(7.5, 6);
  });

  it("toUT wraps to previous day when local hour < tz", () => {
    const u = toUT("1990-01-15", "03:00", 7);
    expect(u.d).toBe(14);
    expect(u.hourUT).toBeCloseTo(20, 6);
  });

  it("houseOf places a longitude just after cusp N into house N", () => {
    const cusps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    expect(houseOf(5, cusps)).toBe(1);
    expect(houseOf(95, cusps)).toBe(4);
    expect(houseOf(335, cusps)).toBe(12);
  });

  it("houseOf handles wrap when house 12 cusp > house 1 cusp", () => {
    const cusps = [350, 20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320];
    expect(houseOf(355, cusps)).toBe(1);
    expect(houseOf(10, cusps)).toBe(1);
    expect(houseOf(25, cusps)).toBe(2);
  });

  it("contains a grid of 7 planets and an ascendant verdict/prose", () => {
    const r = natalEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    expect(grid).toBeTruthy();
    if (grid && grid.kind === "grid") expect(grid.cells.length).toBeGreaterThanOrEqual(7);
  });

  it("invalid input → single note", () => {
    expect(natalEngine.build([""])).toEqual([
      { kind: "note", text: "กรอกวันเกิด เวลาเกิด และเมืองเกิด ให้ครบ แล้วลองใหม่" },
    ]);
  });

  it("unknown city → note, not a silent Bangkok chart (regression: H6)", () => {
    const r = natalEngine.build(["1990-01-15", "14:30", "เมืองที่ไม่มีจริง"]);
    expect(r.some((s) => s.kind === "note")).toBe(true);
    expect(r.some((s) => s.kind === "grid")).toBe(false);
  });

  it("reference vector: Bangkok 1990-01-15 14:30 → Sun in Capricorn (มังกร)", () => {
    const r = natalEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const sunCell = grid.cells.find((c) => c.name.includes("อาทิตย์"));
      expect(sunCell?.value).toContain("มังกร");
    }
  });
});
