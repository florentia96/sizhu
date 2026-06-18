import { describe, it, expect } from "vitest";
import { ascMeta, ascFields } from "./meta";
import { RASI_TH, RASI_RULER, EL_NOTE } from "./content";

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
  it("element notes present", () => {
    for (const el of ["ไฟ", "ดิน", "ลม", "น้ำ"]) expect(EL_NOTE[el].length).toBeGreaterThan(0);
  });
});
