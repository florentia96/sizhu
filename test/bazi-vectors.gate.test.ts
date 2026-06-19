import { describe, it, expect } from "vitest";
import { compute } from "../src/engine/bazi";
import type { Sex } from "../src/types";
import vectors from "./vectors/pillars.json";

// F5 GATE: ย้ายไฟล์ App → BaziApp ต้องไม่แตะ engine — สี่เสาต้องตรง sxtwl ครบทุก vector
describe("F5 gate: bazi pillar vectors stay green after file move", () => {
  it("loads at least 12 reference vectors", () => {
    expect(vectors.length).toBeGreaterThanOrEqual(12);
  });
  for (const v of vectors) {
    const [y, mo, d, h, mi, s] = v.in as [number, number, number, number, number, Sex];
    it(`${y}-${mo}-${d} ${h}:${mi} ${s} → ${v.p.join(" ")}`, () => {
      const r = compute({
        year: y, month: mo, day: d, hour: h, minute: mi,
        sex: s, tz: 7, lon: 100.5, useSolar: false,
      });
      expect([
        r.pillars.year.gz, r.pillars.month.gz, r.pillars.day.gz, r.pillars.hour.gz,
      ]).toEqual(v.p);
    });
  }
});
