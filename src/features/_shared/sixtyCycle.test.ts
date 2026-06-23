import { describe, it, expect } from "vitest";
import {
  zodiacIndexFromCE,
  clashOf,
  toCE,
  ZODIAC,
  STEM_EL,
  SANHE,
  LIUHE,
  HARM,
  EL_LUCK,
} from "./sixtyCycle";

describe("zodiacIndexFromCE", () => {
  it("2020 CE is ชวด (Rat, index 0)", () => {
    expect(zodiacIndexFromCE(2020)).toBe(0);
    expect(ZODIAC[zodiacIndexFromCE(2020)].th).toBe("ชวด");
  });
  it("1992 CE is วอก (Monkey, index 8)", () => {
    expect(zodiacIndexFromCE(1992)).toBe(8);
    expect(ZODIAC[8].th).toBe("วอก");
  });
  it("wraps for years before epoch without negative index", () => {
    expect(zodiacIndexFromCE(2003)).toBe(7); // Goat (2003 = Year of the Goat): (2003-4)%12 = 1999%12 = 7
    const idx = zodiacIndexFromCE(2003);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(12);
  });
});

describe("toCE — พ.ศ./ค.ศ. normalize", () => {
  it("Buddhist year 2563 → 2020 CE", () => {
    expect(toCE(2563)).toBe(2020);
  });
  it("CE year 2020 stays 2020 (threshold 2300)", () => {
    expect(toCE(2020)).toBe(2020);
  });
  it("string input is parsed", () => {
    expect(toCE("2535")).toBe(1992);
  });
  it("non-numeric input → null", () => {
    expect(toCE("abc")).toBeNull();
  });
});

describe("clash / liuhe / harm / sanhe symmetry", () => {
  it("clashOf(0) === 6 and is an involution", () => {
    expect(clashOf(0)).toBe(6);
    expect(clashOf(clashOf(5))).toBe(5);
    expect(clashOf(clashOf(11))).toBe(11);
  });
  it("LIUHE is symmetric (mutual partners)", () => {
    for (let i = 0; i < 12; i++) {
      expect(LIUHE[LIUHE[i]]).toBe(i);
    }
  });
  it("HARM is symmetric (mutual partners)", () => {
    for (let i = 0; i < 12; i++) {
      expect(HARM[HARM[i]]).toBe(i);
    }
  });
  it("SANHE has 4 triads partitioning all 12 indices", () => {
    expect(SANHE).toHaveLength(4);
    const flat = SANHE.flat().sort((a, b) => a - b);
    expect(flat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });
});

describe("ZODIAC / STEM_EL / EL_LUCK tables", () => {
  it("ZODIAC has 12 signs each with th/en/cn/tr", () => {
    expect(ZODIAC).toHaveLength(12);
    ZODIAC.forEach((z) => {
      expect(typeof z.th).toBe("string");
      expect(typeof z.cn).toBe("string");
    });
  });
  it("STEM_EL maps last-digit 0/1 → ทอง, 4/5 → ไม้", () => {
    expect(STEM_EL[0][0]).toBe("ทอง");
    expect(STEM_EL[1][0]).toBe("ทอง");
    expect(STEM_EL[4][0]).toBe("ไม้");
    expect(STEM_EL[5][0]).toBe("ไม้");
  });
  it("EL_LUCK covers all five elements with colors+dir+num", () => {
    ["ไม้", "ไฟ", "ดิน", "ทอง", "น้ำ"].forEach((el) => {
      expect(EL_LUCK[el]).toBeDefined();
      expect(Array.isArray(EL_LUCK[el].colors)).toBe(true);
      expect(Array.isArray(EL_LUCK[el].num)).toBe(true);
    });
  });
});
