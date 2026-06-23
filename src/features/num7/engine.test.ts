import { describe, it, expect } from "vitest";
import { engine, compute7 } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("num7 engine", () => {
  // Reference vector: 1987-01-01 = Thursday -> day seed=5, month seed=1,
  // year seed = Rabbit zodiac year (1987 = Rabbit, zodiac index 4) -> ring7(4)=4
  it("computes the 7 bases for 1987-01-01 (Thursday, ปีเถาะ)", () => {
    expect(compute7("1987-01-01")).toEqual([
      [5, 6, 7, 1, 2, 3, 4], // upper base, Thursday=5
      [1, 2, 3, 4, 5, 6, 7], // middle base, month 1
      [4, 5, 6, 7, 1, 2, 3], // lower base, Rabbit zodiac year=4
      [10, 13, 16, 12, 8, 11, 14], // base4 column sum (raw)
      [3, 6, 2, 5, 1, 4, 7], // base5 reduce(base4)
      [6, 5, 4, 3, 2, 1, 7], // base6 reduce(base5 x2)
      [5, 3, 1, 6, 4, 2, 7], // base7 reduce(base6 x2)
    ]);
  });
  it("year seed uses ปีนักษัตร, not digit-root of CE year", () => {
    // 2008 = Rat year (zodiac index 1) -> lower base, first cell = ring7(1) = 1
    const g2008 = compute7("2008-01-15")!;
    expect(g2008[2][0]).toBe(1);
    // 2020 = Rat year too (12-year cycle) -> lower base, first cell is the same
    const g2020 = compute7("2020-06-10")!;
    expect(g2020[2][0]).toBe(1);
  });
  it("day seed: อาทิตย์=1 .. เสาร์=7", () => {
    // 2023-01-01 = Sunday -> upper base, first cell = 1
    expect(compute7("2023-01-01")![0][0]).toBe(1);
    // 2023-01-07 = Saturday -> upper base, first cell = 7
    expect(compute7("2023-01-07")![0][0]).toBe(7);
  });
  it("each base row walks +1 with wrap 7→1", () => {
    const top = compute7("1987-01-01")![0];
    for (let i = 1; i < 7; i++) {
      const expected = top[i - 1] === 7 ? 1 : top[i - 1] + 1;
      expect(top[i]).toBe(expected);
    }
  });
  it("ฐาน7 differs from ฐาน4 (no doubling-cycle collapse)", () => {
    const g = compute7("1987-01-01")!;
    expect(g[6]).not.toEqual(g[3]);
  });
  it("rows 1-3 and 5-7 stay within 1..7", () => {
    const g = compute7("1990-07-15")!;
    for (const r of [0, 1, 2, 4, 5, 6])
      for (const v of g[r]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(7);
      }
  });
  it("accepts พ.ศ. and normalizes to ค.ศ. (same as CE input)", () => {
    expect(compute7("2530-01-01")).toEqual(compute7("1987-01-01"));
  });
  it("is deterministic", () => {
    expect(engine.build(["1987-01-01"])).toEqual(engine.build(["1987-01-01"]));
  });
  it("output passes ReportSchema", () => {
    expect(() => ReportSchema.parse(engine.build(["1987-01-01"]))).not.toThrow();
  });
  it("leads with a verdict summary (no score ring) naming day + นักษัตร + ดาวประจำตัว", () => {
    const secs = engine.build(["1987-01-01"]);
    const v = secs[0] as Extract<(typeof secs)[number], { kind: "verdict" }>;
    expect(v.kind).toBe("verdict");
    expect(v.hideRing).toBe(true);
    expect(v.summary).toContain("พฤหัส");
    expect(v.summary).toContain("เถาะ");
    expect(v.summary).toContain("ภพ"); // identifies the prominent phop
  });
  it("emits grid + how-to-read + per-base prose for all 21 ภพ", () => {
    const secs = engine.build(["1987-01-01"]);
    const kinds = secs.map((s) => s.kind);
    expect(kinds).toContain("grid");
    expect(kinds).toContain("blocks");
    expect(kinds).toContain("prose");
    const grid = secs.find((s) => s.kind === "grid") as Extract<
      (typeof secs)[number],
      { kind: "grid" }
    >;
    expect(grid.cells).toHaveLength(21); // 3 bases x 7 phop
    expect(grid.cells[0].name).toBe("อัตตะ");
    // 3 prose cards for the bases + 1 how-to-read card = all 21 phop cells
    const proseParas = secs
      .filter((s) => s.kind === "prose")
      .flatMap((s) => (s as Extract<(typeof secs)[number], { kind: "prose" }>).paras);
    const phopHeads = proseParas.filter((p) => p.h && p.h.includes(" — "));
    expect(phopHeads).toHaveLength(21);
  });
  it("every grid cell carries the planet name for its number", () => {
    const secs = engine.build(["1987-01-01"]);
    const grid = secs.find((s) => s.kind === "grid") as Extract<
      (typeof secs)[number],
      { kind: "grid" }
    >;
    for (const c of grid.cells) {
      expect(c.note && c.note.length).toBeGreaterThan(0);
    }
  });
  it("bad input → single note (no throw)", () => {
    expect(engine.build([""])).toEqual([{ kind: "note", text: expect.stringContaining("วันเกิด") }]);
    expect(engine.build(["not-a-date"])).toEqual([
      { kind: "note", text: expect.stringContaining("วันเกิด") },
    ]);
  });
  it("polite-neutral tone: no gendered/slang particles in any text", () => {
    const secs = engine.build(["1987-01-01"]);
    // match particles only as sentence-enders (followed by quote/space/punct/end),
    // so legitimate words like "chao chata" or "khanaen" do not false-positive
    const PARTICLES = /(ครับ|ค่ะ|คะ|นะคะ|จ้า|จ้ะ|ฮะ|ฮ่ะ)(?=["'\s.,!?)]|$)/;
    const blob = JSON.stringify(secs);
    expect(blob).not.toMatch(PARTICLES);
  });
});
