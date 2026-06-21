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
    const v = ["1990-01-15", "", "", "1992-07-20"];
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
    const r = compatEngine.build(["1990-01-15", "", "", "1992-07-20"]);
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
    const r = compatEngine.build(["1990-01-15", "", "", "1992-07-20"]);
    const blocks = r.filter((s) => s.kind === "blocks");
    expect(blocks.length).toBe(0);
  });
});

describe("compat engine — result completeness", () => {
  const datesOnly = compatEngine.build(["1990-01-15", "", "", "1992-07-20"]);

  it("includes a sign love-reading prose for both parties", () => {
    const love = datesOnly.find((s) => s.kind === "prose" && s.title === "ราศีกับการครองคู่");
    expect(love).toBeTruthy();
    if (love && love.kind === "prose") {
      expect(love.paras.length).toBe(3);
      for (const p of love.paras) expect(p.t.length).toBeGreaterThan(0);
    }
  });

  it("includes per-couple advice prose", () => {
    const advice = datesOnly.find((s) => s.kind === "prose" && s.title === "คำแนะนำสำหรับคู่นี้");
    expect(advice).toBeTruthy();
  });

  it("date-only path adds an unlock-guidance prose (graceful, not thin)", () => {
    const unlock = datesOnly.find((s) => s.kind === "prose" && s.title.includes("ลึกขึ้น"));
    expect(unlock).toBeTruthy();
    // every section has real content — no empty paras / cells
    for (const s of datesOnly) {
      if (s.kind === "prose") for (const p of s.paras) expect(p.t.length).toBeGreaterThan(0);
      if (s.kind === "grid") for (const c of s.cells) expect(c.value.length).toBeGreaterThan(0);
    }
  });

  it("element point text varies by element relationship", () => {
    // harmonious (ไฟ×ลม) vs same-element (ดิน×ดิน) must differ
    const harm = compatEngine.build(["1990-04-20", "", "", "1990-06-20"])[0];
    const same = compatEngine.build(["1990-01-15", "", "", "1991-01-20"])[0];
    if (harm.kind === "compat" && same.kind === "compat") {
      expect(harm.points[0].meaning).not.toBe(same.points[0].meaning);
    }
  });

  it("tone: no ครับ/ค่ะ and no 3+ item ' · ' stacking inside sentences", () => {
    const text = JSON.stringify(datesOnly);
    expect(text).not.toMatch(/ครับ|ค่ะ/);
    // a sentence-level ' · ' run joining 3+ items would show as two+ ' · '
    // in one string; section text fields must not contain ' · ' at all here
    for (const s of datesOnly) {
      if (s.kind === "note") expect(s.text).not.toContain(" · ");
      if (s.kind === "prose") for (const p of s.paras) expect(p.t).not.toContain(" · ");
    }
  });
});
