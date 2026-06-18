import { describe, it, expect } from "vitest";
import { placidusCusps, ascendant, midheaven } from "./houses";
import { julianDay } from "../engine/astro";

const sep = (a: number, b: number): number => {
  const d = (Math.abs(((a - b) % 360) + 360)) % 360;
  return d > 180 ? 360 - d : d;
};

describe("F4.4 placidusCusps — structural invariants", () => {
  const inp = { jdUT: julianDay(1990, 7, 15, 5.5), lat: 13.75, lon: 100.5 };

  it("returns 12 cusps, all 0..360", () => {
    const c = placidusCusps(inp);
    expect(c.length).toBe(12);
    for (const x of c) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(360);
    }
  });

  it("cusp 1 = Ascendant, cusp 10 = Midheaven (within 1e-6°)", () => {
    const c = placidusCusps(inp);
    expect(sep(c[0], ascendant(inp).deg)).toBeLessThan(1e-6);
    expect(sep(c[9], midheaven(inp).deg)).toBeLessThan(1e-6);
  });

  it("opposite cusps are 180° apart (1↔7, 2↔8, 3↔9, 10↔4 ...)", () => {
    const c = placidusCusps(inp);
    for (let i = 0; i < 6; i++) {
      expect(Math.abs(sep(c[i], c[i + 6]) - 180)).toBeLessThan(1e-4);
    }
  });

  it("cusps advance monotonically around the zodiac (each step in 0..180)", () => {
    const c = placidusCusps(inp);
    for (let i = 0; i < 12; i++) {
      const step = (((c[(i + 1) % 12] - c[i]) % 360) + 360) % 360;
      expect(step).toBeGreaterThan(0);
      expect(step).toBeLessThan(180);
    }
  });

  it("is deterministic", () => {
    const a = placidusCusps(inp);
    const b = placidusCusps(inp);
    expect(a).toEqual(b);
  });
});
