import { describe, it, expect } from "vitest";
import { LETTER_VALUE, plateLetterSum, plateDigitSum, plateCombinedSum } from "./content";

describe("license consonant table", () => {
  it("every Thai consonant key maps to 1..9", () => {
    const vals = Object.values(LETTER_VALUE);
    expect(vals.length).toBeGreaterThan(40);
    vals.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(9);
    });
  });
  it("anchor buckets per the cited table", () => {
    expect(LETTER_VALUE["ก"]).toBe(1);
    expect(LETTER_VALUE["ข"]).toBe(2);
    expect(LETTER_VALUE["ต"]).toBe(3);
    expect(LETTER_VALUE["ร"]).toBe(4);
    expect(LETTER_VALUE["น"]).toBe(5);
    expect(LETTER_VALUE["อ"]).toBe(6);
    expect(LETTER_VALUE["ส"]).toBe(7);
    expect(LETTER_VALUE["พ"]).toBe(8);
    expect(LETTER_VALUE["ฐ"]).toBe(9);
    // verified against ktc.co.th / insurverse.co.th — ฏ groups with ฐ (=9), ฑ with ต (=3)
    expect(LETTER_VALUE["ฏ"]).toBe(9);
    expect(LETTER_VALUE["ฑ"]).toBe(3);
  });
  it("hand-worked vector: 1กก234 -> letterSum 2, digitSum 10, combined 12", () => {
    expect(plateLetterSum("1กก234")).toBe(2);
    expect(plateDigitSum("1กก234")).toBe(10);
    const r = plateCombinedSum("1กก234");
    expect(r.letterValueSum).toBe(2);
    expect(r.digitSum).toBe(10);
    expect(r.combinedSum).toBe(12);
    expect(r.letters).toEqual([
      { ch: "ก", value: 1 },
      { ch: "ก", value: 1 },
    ]);
  });
  it("ignores spaces/dashes and non-table chars", () => {
    expect(plateDigitSum("1กก-234")).toBe(10);
    expect(plateLetterSum("1กก-234")).toBe(2);
  });
});
