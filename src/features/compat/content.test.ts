import { describe, it, expect } from "vitest";
import { elementPair, SIGN_LOVE_TH, EL_HARMONY } from "./content";

const ELEMENTS = ["ไฟ", "ลม", "น้ำ", "ดิน"];

describe("compat content — elementPair", () => {
  it("covers every ordered element combination (no fallback hit)", () => {
    for (const a of ELEMENTS)
      for (const b of ELEMENTS) {
        const r = elementPair(a, b);
        expect(r.th.length).toBeGreaterThan(0);
        expect(["same", "harmony", "challenge"]).toContain(r.kind);
      }
  });

  it("is order-independent (symmetric)", () => {
    for (const a of ELEMENTS)
      for (const b of ELEMENTS)
        expect(elementPair(a, b)).toEqual(elementPair(b, a));
  });

  it("same element pairs are kind=same", () => {
    for (const e of ELEMENTS) expect(elementPair(e, e).kind).toBe("same");
  });

  it("matches EL_HARMONY: harmony pairs are kind=harmony, others kind=challenge", () => {
    for (const a of ELEMENTS)
      for (const b of ELEMENTS) {
        if (a === b) continue;
        const expected = EL_HARMONY[a] === b ? "harmony" : "challenge";
        expect(elementPair(a, b).kind).toBe(expected);
      }
  });

  it("known harmony narratives mention the nourishing/fueling dynamic", () => {
    expect(elementPair("ลม", "ไฟ").kind).toBe("harmony");
    expect(elementPair("น้ำ", "ดิน").kind).toBe("harmony");
  });
});

describe("compat content — SIGN_LOVE_TH", () => {
  it("has a non-empty love reading for all 12 signs", () => {
    const signs = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
    ];
    for (const s of signs) {
      expect(typeof SIGN_LOVE_TH[s]).toBe("string");
      expect(SIGN_LOVE_TH[s].length).toBeGreaterThan(10);
    }
  });
});
