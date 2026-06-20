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
      { kind: "note", text: "เลือกวันที่ที่ต้องการดู แล้วลองใหม่" },
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

  it("personal year is birthday-aware: same calendar year, before vs after birthday differ", () => {
    const before = lifeEngine.build(["1990-06-19", "12:00", "กรุงเทพมหานคร", "ภาพรวมปีนี้", "2026-06-18"]);
    const after = lifeEngine.build(["1990-06-19", "12:00", "กรุงเทพมหานคร", "ภาพรวมปีนี้", "2026-06-20"]);
    const grade = (r: typeof before) => {
      const v = r.find((s) => s.kind === "verdict");
      return v && v.kind === "verdict" ? v.grade : "";
    };
    expect(grade(before)).not.toBe(grade(after));
  });

  it("transit Moon is kept out of the slow-transit blocks (Moon is too fast to define a period)", () => {
    for (const d of ["2026-06-19", "2026-06-20", "2026-07-01"]) {
      const r = lifeEngine.build(["1985-07-20", "08:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", d]);
      const blocks = r.find((s) => s.kind === "blocks");
      if (blocks && blocks.kind === "blocks") {
        expect(blocks.items.some((it) => it.title.startsWith("จันทร์ จร"))).toBe(false);
      }
    }
  });

  it("conjunction tone follows the transiting planet (benefic→good, malefic→warn)", () => {
    const accents = new Set<string>();
    for (const d of ["2026-01-15", "2026-03-15", "2026-06-19", "2026-09-15", "2026-12-15", "2027-04-10"]) {
      const r = lifeEngine.build(["1985-07-20", "08:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", d]);
      const blocks = r.find((s) => s.kind === "blocks");
      if (blocks && blocks.kind === "blocks")
        for (const it of blocks.items)
          if (it.tag.includes("Conjunction")) accents.add(it.accent);
    }
    // a malefic conjunction (Saturn/Mars) must be able to surface as a warn tone, not a flat "info"
    expect(accents.has("#d8a64a")).toBe(true);
  });

  it("rich result: every scope yields focus prose + practical cards (no thin output)", () => {
    for (const scope of ["ภาพรวมปีนี้", "เน้นการงาน", "เน้นการเงิน", "เน้นความรัก"]) {
      const r = lifeEngine.build(["1985-07-20", "08:30", "กรุงเทพมหานคร", scope, "2026-06-19"]);
      expect(r.some((s) => s.kind === "prose" && s.title.includes("จุดเน้น"))).toBe(true);
      const cards = r.find((s) => s.kind === "cards" && s.title.includes("แนวทางปฏิบัติ"));
      expect(cards).toBeTruthy();
      if (cards && cards.kind === "cards") expect(cards.items.length).toBeGreaterThanOrEqual(3);
      // numerology guidance present
      expect(r.some((s) => s.kind === "prose" && s.paras.some((p) => p.h?.includes("ควรทำ")))).toBe(true);
    }
  });

  it("polite-neutral tone: no ครับ/ค่ะ anywhere in the rendered text", () => {
    const r = lifeEngine.build(["1985-07-20", "08:30", "กรุงเทพมหานคร", "เน้นการงาน", "2026-06-19"]);
    const blob = JSON.stringify(r);
    expect(/ครับ|ค่ะ|จ้า|นะคะ/.test(blob)).toBe(false);
  });
});
