import { describe, it, expect } from "vitest";
import {
  gregorianToJDN,
  chulaSakaratForMonth,
  kalaWeekdays,
  lunarPhase,
} from "./thaiLunar";

describe("thaiLunar — กาลโยค + ดิถี", () => {
  it("จ.ศ. = พ.ศ. − 1181, flips at สงกรานต์ (16 เม.ย.)", () => {
    // ค.ศ. 2025 = พ.ศ. 2568 → จ.ศ. 1387 (หลัง 16 เม.ย.)
    expect(chulaSakaratForMonth(2025, 5)).toBe(1387);
    // ก่อน 16 เม.ย. ยังเป็นจ.ศ.ปีก่อน
    expect(chulaSakaratForMonth(2025, 3)).toBe(1386);
  });

  it("reference vector vs โหรรัตนโกสินทร์ ปี พ.ศ.2568 (จ.ศ.1387)", () => {
    // เผยแพร่: ธงชัย/อธิบดี=ศุกร์(5) · อุบาทว์=พฤหัส(4) · โลกาวินาศ=อาทิตย์(0)
    // ที่มา: horoscope.kapook.com/view289786.html (โหรรัตนโกสินทร์)
    const w = kalaWeekdays(1387);
    expect(w["ธงชัย"]).toBe(5);
    expect(w["อธิบดี"]).toBe(5);
    expect(w["อุบาทว์"]).toBe(4);
    expect(w["โลกาวินาศ"]).toBe(0);
  });

  it("จ.ศ.1388 แยกผล (พิสูจน์สูตรไม่ใช่ความบังเอิญ)", () => {
    const w = kalaWeekdays(1388);
    expect(w["ธงชัย"]).toBe(1); // จันทร์
    expect(w["อธิบดี"]).toBe(6); // เสาร์
    expect(w["อุบาทว์"]).toBe(0); // อาทิตย์
    // โลกาวินาศ จ.ศ.1388 = จันทร์(1) — ยืนยันกับปฏิทินกาลโยค พ.ศ.2569 (ครึ่งหลัง 16 เม.ย.):
    // ธงชัย=จันทร์ · อธิบดี=เสาร์ · โลกาวินาศ=จันทร์ (pptvhd36.com/news/264625, nsquare.co kala-yok)
    expect(w["โลกาวินาศ"]).toBe(1); // จันทร์

  });

  it("gregorianToJDN — วันอ้างอิงที่ทราบค่า", () => {
    // 2000-01-01 12:00 UT = JD 2451545 → JDN 2451545
    expect(gregorianToJDN(2000, 1, 1)).toBe(2451545);
  });

  it("lunarPhase — new moon 2025-03-29 ใกล้ดิถีต้นเดือน, เต็มดวงเป็นข้างขึ้น", () => {
    const nm = lunarPhase(gregorianToJDN(2025, 3, 29));
    expect(nm.age).toBeLessThan(1.5);
    const wax = lunarPhase(gregorianToJDN(2025, 4, 5)); // ~ขึ้น 8 ค่ำ
    expect(wax.waxing).toBe(true);
    expect(wax.dithi).toBeGreaterThanOrEqual(1);
    expect(wax.dithi).toBeLessThanOrEqual(15);
  });
});
