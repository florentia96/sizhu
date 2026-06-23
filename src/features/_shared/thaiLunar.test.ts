import { describe, it, expect } from "vitest";
import {
  gregorianToJDN,
  chulaSakaratForMonth,
  kalaWeekdays,
  lunarPhase,
} from "./thaiLunar";

describe("thaiLunar — กาลโยค + ดิถี", () => {
  it("จ.ศ. = พ.ศ. − 1181, flips at สงกรานต์ (16 เม.ย.)", () => {
    // CE 2025 = BE 2568 -> Chula Sakarat (CS) 1387 (after Apr 16)
    expect(chulaSakaratForMonth(2025, 5)).toBe(1387);
    // before Apr 16 it is still the previous CS year
    expect(chulaSakaratForMonth(2025, 3)).toBe(1386);
  });

  it("reference vector vs โหรรัตนโกสินทร์ ปี พ.ศ.2568 (จ.ศ.1387)", () => {
    // published: thongchai/athibodi=Friday(5) - ubat=Thursday(4) - lokawinat=Sunday(0)
    // Source: horoscope.kapook.com/view289786.html (Hora Rattanakosin)
    const w = kalaWeekdays(1387);
    expect(w["ธงชัย"]).toBe(5);
    expect(w["อธิบดี"]).toBe(5);
    expect(w["อุบาทว์"]).toBe(4);
    expect(w["โลกาวินาศ"]).toBe(0);
  });

  it("จ.ศ.1388 แยกผล (พิสูจน์สูตรไม่ใช่ความบังเอิญ)", () => {
    const w = kalaWeekdays(1388);
    expect(w["ธงชัย"]).toBe(1); // Monday
    expect(w["อธิบดี"]).toBe(6); // Saturday
    expect(w["อุบาทว์"]).toBe(0); // Sunday
    // lokawinat CS 1388 = Monday(1) - confirmed against the kala-yok calendar for BE 2569 (second half, after Apr 16):
    // thongchai=Monday - athibodi=Saturday - lokawinat=Monday (pptvhd36.com/news/264625, nsquare.co kala-yok)
    expect(w["โลกาวินาศ"]).toBe(1); // Monday

  });

  it("gregorianToJDN — วันอ้างอิงที่ทราบค่า", () => {
    // 2000-01-01 12:00 UT = JD 2451545 -> JDN 2451545
    expect(gregorianToJDN(2000, 1, 1)).toBe(2451545);
  });

  it("lunarPhase — new moon 2025-03-29 ใกล้ดิถีต้นเดือน, เต็มดวงเป็นข้างขึ้น", () => {
    const nm = lunarPhase(gregorianToJDN(2025, 3, 29));
    expect(nm.age).toBeLessThan(1.5);
    const wax = lunarPhase(gregorianToJDN(2025, 4, 5)); // ~waxing day 8
    expect(wax.waxing).toBe(true);
    expect(wax.dithi).toBeGreaterThanOrEqual(1);
    expect(wax.dithi).toBeLessThanOrEqual(15);
  });
});
