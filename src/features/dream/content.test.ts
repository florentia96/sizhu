import { describe, it, expect } from "vitest";
import { DREAM } from "./content";

describe("dream dictionary", () => {
  it("has at least 40 entries (legacy 20 + expanded 20)", () => {
    expect(DREAM.length).toBeGreaterThanOrEqual(40);
  });
  it("every entry has keywords, meaning, numbers", () => {
    DREAM.forEach((e) => {
      expect(e.kw.length).toBeGreaterThan(0);
      expect(e.kw.every((k) => typeof k === "string" && k.length > 0)).toBe(true);
      expect(typeof e.m).toBe("string");
      expect(e.n.length).toBeGreaterThan(0);
      expect(e.n.every((x) => /^[0-9]{1,3}$/.test(x))).toBe(true);
    });
  });
  it("keeps the legacy snake entry verbatim", () => {
    const snake = DREAM.find((e) => e.kw.includes("งู"));
    expect(snake?.n).toEqual(["56", "89", "5", "9", "569"]);
  });
  it("keywords are unique across entries (no overlap that double-matches)", () => {
    const seen = new Set<string>();
    DREAM.forEach((e) =>
      e.kw.forEach((k) => {
        expect(seen.has(k)).toBe(false);
        seen.add(k);
      }),
    );
  });
});
