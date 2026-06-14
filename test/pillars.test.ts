import { describe, it, expect } from "vitest";
import { compute } from "../src/engine/bazi";
import type { Sex } from "../src/types";
import vectors from "./vectors/pillars.json";
import monthVectors from "./vectors/pillars-months.json";

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

// สำนักเวลาจื่อ — early-zi ต้องเลื่อนเสาวันช่วง 23:00–24:00 เป็นวันถัดไป
// ตรวจไขว้กับเสาวันของ "วันถัดไป" ที่ผ่าน sxtwl แล้ว (ไม่ circular)
describe("engine: สำนักเวลาจื่อ late ↔ early", () => {
  const base = {
    year: 1996, month: 4, day: 3, hour: 23, minute: 58,
    sex: "M" as Sex, tz: 7, lon: 100.5, useSolar: false,
  };
  it("late (ดีฟอลต์): 23:58 → เสาวัน 庚午 ยาม 丙子 (ตรง sxtwl)", () => {
    const r = compute(base);
    expect(r.pillars.day.gz).toBe("庚午");
    expect(r.pillars.hour.gz).toBe("丙子");
  });
  it("early: 23:58 → เสาวันเลื่อนเป็น 辛未 (= วันถัดไป) ยาม 戊子", () => {
    const r = compute({ ...base, zi: "early" });
    expect(r.pillars.day.gz).toBe("辛未"); // 1996-04-04 (late) = 辛未 ผ่าน sxtwl แล้ว
    expect(r.pillars.hour.gz).toBe("戊子");
  });
  it("ช่วง 00:00–01:00 ไม่ขึ้นกับสำนักจื่อ (เป็นวันใหม่อยู่แล้ว)", () => {
    const mid = {
      year: 2024, month: 1, day: 1, hour: 0, minute: 30,
      sex: "F" as Sex, tz: 7, lon: 100.5, useSolar: false,
    };
    expect(compute({ ...mid, zi: "early" }).pillars.day.gz).toBe(compute(mid).pillars.day.gz);
    expect(compute(mid).pillars.day.gz).toBe("甲子");
  });
});

// ครอบกิ่งเดือนครบ 12/12 (รวม 巳午戌亥 ที่ vectors หลักไม่มี) — oracle อิสระ lunar-javascript
// เลือกกลางเดือน節 + เที่ยง เพื่อเลี่ยง edge ที่สองสำนักตีต่าง: ก้านยาม子時 (晚子) และขอบ節ที่ tz เลื่อน
describe("engine: สี่เสาครอบ 12 กิ่งเดือน (oracle lunar-javascript, useSolar:false)", () => {
  for (const v of monthVectors) {
    const [y, mo, d, h, mi, s] = v.in as [number, number, number, number, number, Sex];
    it(`${y}-${mo}-${d} ${h}:${mi} → เดือน ${v.p[1]}`, () => {
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
