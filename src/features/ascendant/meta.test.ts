import { describe, it, expect } from "vitest";
import { ascMeta, ascFields } from "./meta";
import {
  RASI_TH,
  RASI_ORDER,
  RASI_RULER,
  RASI_EL,
  RASI_TRAIT,
  RASI_RISING,
  RASI_MOON,
  EL_NOTE,
  EL_GUIDE,
  HOUSE_MEANING,
} from "./content";

describe("ascendant meta/fields/content", () => {
  it("meta complete", () => {
    expect(ascMeta.id).toBe("ascendant");
    for (const k of ["name", "cn", "desc", "long"] as const)
      expect((ascMeta as unknown as Record<string, string>)[k].length).toBeGreaterThan(0);
  });
  it("fields date,time,city", () => {
    expect(ascFields.map((f) => f.type)).toEqual(["date", "time", "city"]);
  });
  it("12 signs map to Thai rasi and have rulers", () => {
    const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    for (const s of signs) {
      expect(typeof RASI_TH[s]).toBe("string");
      expect(typeof RASI_RULER[RASI_TH[s]]).toBe("string");
    }
  });
  it("element notes + practical guides present for all 4 elements", () => {
    for (const el of ["ไฟ", "ดิน", "ลม", "น้ำ"]) {
      expect(EL_NOTE[el].length).toBeGreaterThan(0);
      expect(EL_GUIDE[el].length).toBeGreaterThan(0);
    }
  });

  it("all 12 rasi have element, trait, rising-image, and moon-meaning copy", () => {
    expect(RASI_ORDER).toHaveLength(12);
    for (const rasi of RASI_ORDER) {
      expect(RASI_EL[rasi]).toBeTruthy();
      expect(RASI_TRAIT[rasi].length).toBeGreaterThan(0);
      expect(RASI_RISING[rasi].length).toBeGreaterThan(0);
      expect(RASI_MOON[rasi].length).toBeGreaterThan(0);
    }
  });

  it("RASI_ORDER matches the canonical sign order from RASI_TH", () => {
    const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    expect(RASI_ORDER).toEqual(signs.map((s) => RASI_TH[s]));
  });

  it("12 house meanings present", () => {
    expect(HOUSE_MEANING).toHaveLength(12);
    for (const m of HOUSE_MEANING) expect(m.length).toBeGreaterThan(0);
  });

  it("user-facing copy stays polite-neutral (no ครับ/ค่ะ)", () => {
    const blob = [
      ...Object.values(RASI_TRAIT),
      ...Object.values(RASI_RISING),
      ...Object.values(RASI_MOON),
      ...Object.values(EL_GUIDE),
      ...Object.values(EL_NOTE),
      ...HOUSE_MEANING,
    ].join(" ");
    expect(blob).not.toMatch(/ครับ|ค่ะ|คะ/);
  });
});
