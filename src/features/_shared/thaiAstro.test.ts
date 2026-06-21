import { describe, it, expect } from "vitest";
import {
  dayFromDate,
  rasiFromDate,
  lifePathFromDate,
  personalYear,
  swatch,
  reduce9,
  reduceSingle,
  RASI,
  THAI_DAYS,
  DAY_LORD,
  COLOR_HEX,
  LIFEPATH,
  PY_THEME,
} from "./thaiAstro";

describe("dayFromDate", () => {
  it("2000-01-01 is เสาร์ (Saturday)", () => {
    expect(dayFromDate(2000, 1, 1)).toBe("เสาร์");
  });
  it("month arg is 1-based (m=1 → January)", () => {
    // 2024-12-25 was a Wednesday
    expect(dayFromDate(2024, 12, 25)).toBe("พุธ");
  });
  it("THAI_DAYS is indexed by getDay() with index 0 = อาทิตย์", () => {
    expect(THAI_DAYS[0]).toBe("อาทิตย์");
    expect(THAI_DAYS[6]).toBe("เสาร์");
  });
});

describe("rasiFromDate — boundaries", () => {
  it("Jan 15 is มังกร (start of มังกร range)", () => {
    expect(rasiFromDate(1, 15).s).toBe("มังกร");
  });
  it("Jan 14 is ธนู (wrap-around range Dec 16 → Jan 14)", () => {
    expect(rasiFromDate(1, 14).s).toBe("ธนู");
  });
  it("Dec 16 is ธนู (lower edge of wrap range)", () => {
    expect(rasiFromDate(12, 16).s).toBe("ธนู");
  });
  it("Dec 15 is พิจิก (just before ธนู)", () => {
    expect(rasiFromDate(12, 15).s).toBe("พิจิก");
  });
  it("each rasi carries el + en + tr", () => {
    const r = rasiFromDate(4, 13); // เมษ
    expect(r.s).toBe("เมษ");
    expect(r.en).toBe("Aries");
    expect(r.el).toBe("ไฟ");
    expect(typeof r.tr).toBe("string");
  });
  it("RASI has 12 entries", () => {
    expect(RASI).toHaveLength(12);
  });
});

describe("reduce9 / reduceSingle", () => {
  it("reduce9 keeps master numbers 11 and 22", () => {
    expect(reduce9(29)).toBe(11); // 2+9=11 → kept
    expect(reduce9(2 + 9)).toBe(11);
    expect(reduce9(38)).toBe(11); // 3+8=11
    expect(reduce9(48)).toBe(3); // 4+8=12 → 1+2=3
  });
  it("reduceSingle collapses fully to 1-9 (no master kept)", () => {
    expect(reduceSingle(29)).toBe(2); // 2+9=11 → 1+1=2
    expect(reduceSingle(48)).toBe(3);
  });
});

describe("lifePathFromDate / personalYear", () => {
  it("lifePathFromDate(1990,5,15) === 3", () => {
    // pad2(15)+pad2(5)+1990 = "15"+"05"+"1990" = "15051990"
    // sumDigits = 1+5+0+5+1+9+9+0 = 30 → reduce9 → 3
    expect(lifePathFromDate(1990, 5, 15)).toBe(3);
  });
  it("personalYear(1990,5,15,2026) === 3 (ignores birth year)", () => {
    // reduceSingle(5)=5, reduceSingle(15)=6, reduceSingle(2026)=1 → 5+6+1=12 → 3
    expect(personalYear(1990, 5, 15, 2026)).toBe(3);
  });
  it("personalYear ignores the birth year argument entirely", () => {
    expect(personalYear(1990, 5, 15, 2026)).toBe(personalYear(1800, 5, 15, 2026));
  });
  it("deterministic — same input → same output", () => {
    expect(lifePathFromDate(1988, 11, 22)).toBe(lifePathFromDate(1988, 11, 22));
    expect(personalYear(1988, 11, 22, 2026)).toBe(personalYear(1988, 11, 22, 2026));
  });
  it("LIFEPATH and PY_THEME tables are present", () => {
    expect(LIFEPATH[1].k).toBe("ผู้นำ");
    expect(LIFEPATH[22].k).toContain("เลขพลังพิเศษ");
    expect(typeof PY_THEME[1]).toBe("string");
  });
});

describe("swatch / DAY_LORD / COLOR_HEX", () => {
  it("swatch maps Thai color names to hex from COLOR_HEX", () => {
    expect(swatch(["แดง", "ทอง"])).toEqual([
      { name: "แดง", hex: "#d9453b" },
      { name: "ทอง", hex: "#d8a64a" },
    ]);
  });
  it("unknown color falls back to #888", () => {
    expect(swatch(["ไม่มีสีนี้"])).toEqual([{ name: "ไม่มีสีนี้", hex: "#888" }]);
  });
  it("empty / undefined input yields empty array", () => {
    expect(swatch([])).toEqual([]);
  });
  it("DAY_LORD covers all 7 Thai days with lord+color", () => {
    THAI_DAYS.forEach((d) => {
      expect(DAY_LORD[d]).toBeDefined();
      expect(typeof DAY_LORD[d].lord).toBe("string");
      expect(Array.isArray(DAY_LORD[d].color)).toBe(true);
    });
  });
  it("COLOR_HEX maps ทอง to the gold tone hex", () => {
    expect(COLOR_HEX["ทอง"]).toBe("#d8a64a");
  });
  it("every DAY_LORD color name across all aspects resolves to a real hex (no #888 fallback)", () => {
    Object.entries(DAY_LORD).forEach(([day, info]) => {
      const names = [...info.color, ...info.avoid, ...info.work, ...info.money, ...info.love, ...info.luck];
      names.forEach((name) => {
        expect(COLOR_HEX[name], `${day}: "${name}" has no COLOR_HEX entry`).toBeDefined();
      });
    });
  });
});
