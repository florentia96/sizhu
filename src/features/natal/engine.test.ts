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

  it("invalid input → targeted note (ขาดวันเกิด / ขาดเวลาเกิดเฉพาะเจาะจง)", () => {
    expect(natalEngine.build([""])[0]).toEqual({
      kind: "note",
      text: "กรอกวันเกิดให้ครบ แล้วลองใหม่",
    });
    // has a birth date but no time -> the note asks only for the birth time, not for already-filled fields
    const noTime = natalEngine.build(["1990-01-15", "", "กรุงเทพมหานคร"]);
    expect(noTime).toHaveLength(1);
    expect(noTime[0].kind === "note" && noTime[0].text.includes("เวลาเกิด")).toBe(true);
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

  it("grid includes the four primary points: 7 planets + Asc + MC = 9 cells", () => {
    const r = natalEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    expect(grid?.kind).toBe("grid");
    if (grid && grid.kind === "grid") {
      expect(grid.cells.length).toBe(9);
      expect(grid.cells.some((c) => c.name.includes("ลัคนา"))).toBe(true);
      expect(grid.cells.some((c) => c.name.includes("กลางฟ้า"))).toBe(true);
    }
  });

  it("renders all 12 house cusps as a cards section", () => {
    const r = natalEngine.build(VALS);
    const houses = r.find((s) => s.kind === "cards" && s.title.includes("เรือน"));
    expect(houses?.kind).toBe("cards");
    if (houses && houses.kind === "cards") {
      expect(houses.items).toHaveLength(12);
      expect(houses.items[0].value).toContain("เรือน 1");
      expect(houses.items[11].value).toContain("เรือน 12");
    }
  });

  it("element balance sums to 8 (7 planets + ascendant) and marks the dominant", () => {
    const r = natalEngine.build(VALS);
    const el = r.find((s) => s.kind === "cards" && s.title.includes("สมดุลธาตุ"));
    expect(el?.kind).toBe("cards");
    if (el && el.kind === "cards") {
      expect(el.items).toHaveLength(4);
      const total = el.items.reduce((sum, it) => {
        const m = it.value.match(/(\d+)\/8/);
        return sum + (m ? Number(m[1]) : 0);
      }, 0);
      expect(total).toBe(8);
      expect(el.items.some((it) => it.badge === "เด่นที่สุด")).toBe(true);
    }
  });

  it("MC and IC (cusp 10 vs cusp 4) are 180° apart in the house-cusps display", () => {
    const r = natalEngine.build(VALS);
    const houses = r.find((s) => s.kind === "cards" && s.title.includes("เรือน"));
    if (houses && houses.kind === "cards") {
      const c10 = houses.items[9].value;
      const c4 = houses.items[3].value;
      // cusp 10 = MC; its opposite IC sits in the sign 6 places along (Aquarius <-> Leo here)
      expect(c10).toContain("กุมภ์");
      expect(c4).toContain("สิงห์");
    }
  });

  it("provides a practical-guidance prose section", () => {
    const r = natalEngine.build(VALS);
    const guide = r.find((s) => s.kind === "prose" && s.title.includes("คำแนะนำ"));
    expect(guide?.kind).toBe("prose");
    if (guide && guide.kind === "prose") expect(guide.paras.length).toBeGreaterThanOrEqual(3);
  });

  it("user-facing text uses polite-neutral Thai (no gendered particles)", () => {
    const r = natalEngine.build(VALS);
    const text = JSON.stringify(r);
    expect(text).not.toMatch(/ครับ|ค่ะ|จ้ะ|จ้า/);
  });
});
