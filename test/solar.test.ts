import { describe, it, expect } from "vitest";
import { equationOfTime } from "../src/engine/astro";
import { compute } from "../src/engine/bazi";

// ส่วน shift ตรวจแยกอิสระจาก sxtwl (sxtwl ไม่ปรับ longitude/EoT ให้เอง — เทียบตรงจะวงกลม)
describe("solar shift — ตรวจแยกเป็น 2 ส่วนอิสระ", () => {
  // ส่วน 1: LMT ผ่าน compute() จริง — เลือก 15 เม.ย. (EoT≈0) เพื่อแยกดูเฉพาะส่วนลองจิจูด
  it("LMT ผ่าน compute(): Bangkok (lon 100.5, tz +7) ≈ -18 นาที", () => {
    const r = compute({
      year: 2001, month: 4, day: 15, hour: 12, minute: 0,
      sex: "M", tz: 7, lon: 100.5, useSolar: true,
    });
    // (100.5 - 7*15)*4 = -18 · วันที่ EoT≈0 จึงเหลือเฉพาะส่วนลองจิจูดให้ตรวจว่า engine แปลงถูก
    expect(Math.abs(r.solarShift - (100.5 - 105) * 4)).toBeLessThan(1.0);
  });

  // ส่วน 2: EoT เทียบค่า NOAA ที่จุดสุดขั้ว analemma (สูตรประมาณ คลาดเคลื่อน < 1 นาที)
  it.each([
    [2, 11, -14.2],
    [5, 14, 3.7],
    [7, 26, -6.5],
    [11, 3, 16.4],
    [4, 15, 0.0],
  ])("EoT %i/%i ~ %f นาที (NOAA)", (m, d, noaa) => {
    expect(Math.abs(equationOfTime(2001, m, d) - noaa)).toBeLessThan(1.0);
  });

  // composition: solarShift = LMT + EoT (ภายในการปัดเศษ 0.1)
  it("solarShift = LMT + EoT", () => {
    const r = compute({
      year: 2001, month: 11, day: 3, hour: 12, minute: 0,
      sex: "M", tz: 7, lon: 100.5, useSolar: true,
    });
    const expected = (100.5 - 105) * 4 + equationOfTime(2001, 11, 3);
    expect(Math.abs(r.solarShift - expected)).toBeLessThan(0.1);
  });

  // T1-1: คนเกิดคาบเส้นยาม เสาเวลาต่างกันตามโหมด — ระบบรองรับทั้งสองและค่าคงที่
  it("boundary 23:10 Bangkok: useSolar เปลี่ยนเสาเวลา (丙子 ↔ 丁亥)", () => {
    const base = {
      year: 1996, month: 4, day: 3, hour: 23, minute: 10,
      sex: "M" as const, tz: 7, lon: 100.5,
    };
    expect(compute({ ...base, useSolar: false }).pillars.hour.gz).toBe("丙子");
    expect(compute({ ...base, useSolar: true }).pillars.hour.gz).toBe("丁亥");
  });
});
