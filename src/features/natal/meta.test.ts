import { describe, it, expect } from "vitest";
import { natalMeta, natalFields } from "./meta";
import { SIGN_TH, SIGN_TRAITS, PLANET_TH, HOUSE_MEANING, ASPECT_TH } from "./content";

describe("natal meta/fields/content", () => {
  it("meta has required keys", () => {
    expect(natalMeta.id).toBe("natal");
    expect(natalMeta.cn.length).toBeGreaterThan(0);
    expect(natalMeta.name.length).toBeGreaterThan(0);
    expect(natalMeta.desc.length).toBeGreaterThan(0);
    expect(natalMeta.long.length).toBeGreaterThan(0);
  });
  it("fields are date,time,city in order", () => {
    expect(natalFields.map((f) => f.type)).toEqual(["date", "time", "city"]);
  });
  it("12 zodiac signs each have Thai + traits", () => {
    const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    for (const s of signs) {
      expect(typeof SIGN_TH[s]).toBe("string");
      expect(SIGN_TRAITS[s].el).toMatch(/ไฟ|ดิน|ลม|น้ำ/);
      expect(SIGN_TRAITS[s].tr.length).toBeGreaterThan(4);
    }
  });
  it("7 classical planets have Thai names", () => {
    for (const p of ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"])
      expect(typeof PLANET_TH[p]).toBe("string");
  });
  it("12 house meanings + 5 aspect types", () => {
    expect(HOUSE_MEANING).toHaveLength(12);
    for (const a of ["conjunction","sextile","square","trine","opposition"]) {
      expect(ASPECT_TH[a].th.length).toBeGreaterThan(0);
      expect(["good","warn","info"]).toContain(ASPECT_TH[a].tone);
    }
  });
});
