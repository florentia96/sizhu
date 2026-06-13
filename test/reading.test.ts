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

  it("ครอบ output space — 2000 ดวงสุ่ม ทุก field ครบ", () => {
    for (let i = 0; i < 2000; i++) {
      const r = compute({
        year: 1900 + Math.floor(Math.random() * 201),
        month: 1 + Math.floor(Math.random() * 12),
        day: 1 + Math.floor(Math.random() * 28),
        hour: Math.floor(Math.random() * 24),
        minute: Math.floor(Math.random() * 60),
        sex: (Math.random() < 0.5 ? "M" : "F") as Sex,
        useSolar: Math.random() < 0.5,
      });
      expect(JSON.stringify(buildReading(r))).not.toMatch(NOISE);
    }
  });
});
