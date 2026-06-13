import { describe, it, expect } from "vitest";
import { compute } from "../src/engine/bazi";
import type { Sex } from "../src/types";
import vectors from "./vectors/pillars.json";

// เกณฑ์ผ่าน: สี่เสาตรงเป๊ะ + อายุเริ่มต้าอวิ้นต่างได้ ≤0.2 ปี + ทิศเดินตรง
// ใช้ useSolar:false เพราะ vectors สร้างจาก sxtwl โดยไม่ปรับเวลาสุริยคติ (ดู test/solar.test.ts สำหรับส่วน shift)
describe("engine: สี่เสาตรงกับ sxtwl (useSolar:false)", () => {
  for (const v of vectors) {
    const [y, mo, d, h, mi, s] = v.in as [number, number, number, number, number, Sex];
    it(`${y}-${mo}-${d} ${h}:${mi} ${s}`, () => {
      const r = compute({
        year: y, month: mo, day: d, hour: h, minute: mi,
        sex: s, tz: 7, lon: 100.5, useSolar: false,
      });
      expect([
        r.pillars.year.gz, r.pillars.month.gz, r.pillars.day.gz, r.pillars.hour.gz,
      ]).toEqual(v.p);
      expect(Math.abs(r.luck.startAge - v.start)).toBeLessThan(0.2);
      expect(r.luck.forward).toBe(v.fwd);
    });
  }
});
