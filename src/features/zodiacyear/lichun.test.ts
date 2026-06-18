import { describe, it, expect } from "vitest";
import { lichunCE, zodiacYearForDate, engine } from "./engine";
import type { Section } from "../../shared/sections/types";

describe("zodiacyear 立春 boundary", () => {
  it("a birth on 1984-01-20 belongs to the previous solar year (1983)", () => {
    expect(lichunCE(1984, 1, 20)).toBe(1983);
  });
  it("a birth on 1984-03-01 stays in 1984", () => {
    expect(lichunCE(1984, 3, 1)).toBe(1984);
  });
  it("a birth on 1984-02-10 (after 立春) stays in 1984", () => {
    expect(lichunCE(1984, 2, 10)).toBe(1984);
  });
  it("zodiacYearForDate maps 1984-01-20 to กุน (Pig, index 11)", () => {
    expect(zodiacYearForDate(1984, 1, 20)).toBe(11);
  });
  it("engine uses the date when provided (1984-01-20 -> กุน)", () => {
    const out = engine.build(["2527", "1984-01-20"]);
    const head = out.find((s) => s.kind === "prose") as Extract<Section, { kind: "prose" }> | undefined;
    expect(head && head.title).toContain("กุน");
  });
  it("engine without a date falls back to calendar year (2527 -> ชวด)", () => {
    const out = engine.build(["2527"]);
    const head = out.find((s) => s.kind === "prose") as Extract<Section, { kind: "prose" }> | undefined;
    expect(head && head.title).toContain("ชวด");
  });
});
