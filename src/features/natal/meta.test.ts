import { describe, it, expect } from "vitest";
import { natalMeta, natalFields } from "./meta";
import {
  SIGN_TH,
  SIGN_TRAITS,
  PLANET_TH,
  PLANET_MEANING,
  HOUSE_MEANING,
  ASPECT_TH,
  ELEMENT_OF_SIGN,
  ELEMENT_TRAIT,
  ELEMENT_GUIDANCE,
  ANGLE_MEANING,
} from "./content";

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
  it("every planet has an astrological meaning string", () => {
    for (const p of ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"])
      expect(PLANET_MEANING[p].length).toBeGreaterThan(4);
  });
  it("all 12 signs map to one of the 4 elements", () => {
    const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    for (const s of signs) expect(["ไฟ","ดิน","ลม","น้ำ"]).toContain(ELEMENT_OF_SIGN[s]);
    // exactly 3 signs per element (triplicities)
    const counts: Record<string, number> = { ไฟ: 0, ดิน: 0, ลม: 0, น้ำ: 0 };
    for (const s of signs) counts[ELEMENT_OF_SIGN[s]]++;
    expect(counts).toEqual({ ไฟ: 3, ดิน: 3, ลม: 3, น้ำ: 3 });
  });
  it("each element has a trait + strong/weak guidance, and both angles have meanings", () => {
    for (const e of ["ไฟ","ดิน","ลม","น้ำ"]) {
      expect(ELEMENT_TRAIT[e].length).toBeGreaterThan(4);
      expect(ELEMENT_GUIDANCE[e].strong.length).toBeGreaterThan(4);
      expect(ELEMENT_GUIDANCE[e].weak.length).toBeGreaterThan(4);
    }
    expect(ANGLE_MEANING.asc.length).toBeGreaterThan(4);
    expect(ANGLE_MEANING.mc.length).toBeGreaterThan(4);
  });
});
