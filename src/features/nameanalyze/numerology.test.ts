import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { nameNumerologySum, numerologySections } from "./numerology";

describe("Thai name numerology (โหราเลขศาสตร์ table)", () => {
  it("single consonant ก = 1", () => {
    expect(nameNumerologySum("ก").sum).toBe(1);
    expect(nameNumerologySum("ก").reduced).toBe(1);
  });

  it("reference vector ธนกฤต = 14 → 5", () => {
    const r = nameNumerologySum("ธนกฤต");
    expect(r.sum).toBe(14);
    expect(r.reduced).toBe(5);
    expect(r.perChar.map((c) => c.v)).toEqual([4, 5, 1, 1, 3]);
  });

  it("counts vowel glyphs: มี = ม5 + ี7 = 12 → 3", () => {
    const r = nameNumerologySum("มี");
    expect(r.sum).toBe(12);
    expect(r.reduced).toBe(3);
  });

  it("unknown glyph contributes 0 and does not throw", () => {
    const r = nameNumerologySum("กA1");
    expect(r.sum).toBe(1);
  });

  it("sections satisfy ReportSchema and are deterministic", () => {
    const a = numerologySections("ธนกฤต", "ใจดี");
    const b = numerologySections("ธนกฤต", "ใจดี");
    expect(a).toEqual(b);
    expect(() => ReportSchema.parse(a)).not.toThrow();
  });

  it("section reports separate name and surname sums", () => {
    const secs = numerologySections("ก", "ก");
    const grid = secs.find((s) => s.kind === "grid") as Extract<typeof secs[number], { kind: "grid" }>;
    const names = grid.cells.map((c) => c.name);
    expect(names).toContain("ค่าชื่อ");
    expect(names).toContain("ค่าสกุล");
    expect(names).toContain("ค่ารวม");
  });
});
