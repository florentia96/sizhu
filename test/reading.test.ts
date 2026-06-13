import { describe, it, expect } from "vitest";
import { compute } from "../src/engine/bazi";
import { buildReading } from "../src/lib/reading";
import type { Sex } from "../src/types";

const NOISE = /undefined|NaN|\[object/;

describe("buildReading", () => {
  it("ผลตัวอย่างมีโครงครบ ไม่มี field เพี้ยน", () => {
    const R = buildReading(
      compute({ year: 1996, month: 4, day: 3, hour: 23, minute: 58, sex: "M" }),
    );
    expect(R.headline).toContain("คุณคือ");
    expect(R.pillars).toHaveLength(4);
    expect(R.luck.pillars).toHaveLength(8);
    expect(R.tldr).toHaveLength(6);
    expect(R.tenGods.length).toBeGreaterThan(0);
    expect(JSON.stringify(R)).not.toMatch(NOISE);
  });

  it("ครอบ output space — 2000 ดวง (เมล็ดคงที่ reproduce ได้) ทุก field ครบ", () => {
    // PRNG (mulberry32) เมล็ดคงที่ → ถ้า fail สามารถรันซ้ำได้ผลเดิม ดีบักได้
    let s = 0x9e3779b9;
    const rnd = (): number => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < 2000; i++) {
      const r = compute({
        year: 1900 + Math.floor(rnd() * 201),
        month: 1 + Math.floor(rnd() * 12),
        day: 1 + Math.floor(rnd() * 31), // ครอบวันปลายเดือน 29–31 ด้วย
        hour: Math.floor(rnd() * 24),
        minute: Math.floor(rnd() * 60),
        sex: (rnd() < 0.5 ? "M" : "F") as Sex,
        useSolar: rnd() < 0.5,
        zi: rnd() < 0.5 ? "early" : "late",
      });
      expect(JSON.stringify(buildReading(r))).not.toMatch(NOISE);
    }
  });
});
