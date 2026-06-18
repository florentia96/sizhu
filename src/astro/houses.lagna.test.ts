import { describe, it, expect } from "vitest";
import { lahiriAyanamsa, thaiLagna, ascendant } from "./houses";
import { signFromLon } from "./ephemeris";
import { julianDay } from "../engine/astro";

describe("F4.5 Lahiri ayanamsa — sanity values", () => {
  it("≈ 23.853° at J2000.0", () => {
    expect(Math.abs(lahiriAyanamsa(2451545.0) - 23.853)).toBeLessThan(0.01);
  });

  it("≈ 24.19° in mid-2024 (matches published Lahiri tables ~24°11')", () => {
    const a = lahiriAyanamsa(julianDay(2024, 7, 1, 0));
    expect(a).toBeGreaterThan(24.1);
    expect(a).toBeLessThan(24.25);
  });

  it("grows ~50.24″/yr (about 0.01395°/yr)", () => {
    const a0 = lahiriAyanamsa(julianDay(2000, 1, 1, 0));
    const a1 = lahiriAyanamsa(julianDay(2001, 1, 1, 0));
    expect(Math.abs(a1 - a0 - 50.2388475 / 3600)).toBeLessThan(1e-4);
  });
});

describe("F4.5 thaiLagna — sidereal = tropical − ayanamsa", () => {
  const inp = { jdUT: julianDay(1990, 7, 15, 5.5), lat: 13.75, lon: 100.5 };

  it("sidereal ascendant = tropical ascendant minus ayanamsa", () => {
    const tropical = ascendant(inp).deg;
    const expectedDeg =
      (((tropical - lahiriAyanamsa(inp.jdUT)) % 360) + 360) % 360;
    const lagna = thaiLagna(inp);
    const expected = signFromLon(expectedDeg);
    expect(lagna.rasi).toBe(expected.signTh);
    expect(Math.abs(lagna.deg - expected.deg)).toBeLessThan(1e-6);
  });

  it("returns a Thai rasi name and deg in 0..30", () => {
    const lagna = thaiLagna(inp);
    expect([
      "เมษ",
      "พฤษภ",
      "เมถุน",
      "กรกฎ",
      "สิงห์",
      "กันย์",
      "ตุล",
      "พิจิก",
      "ธนู",
      "มังกร",
      "กุมภ์",
      "มีน",
    ]).toContain(lagna.rasi);
    expect(lagna.deg).toBeGreaterThanOrEqual(0);
    expect(lagna.deg).toBeLessThan(30);
  });

  it("is deterministic", () => {
    expect(thaiLagna(inp)).toEqual(thaiLagna(inp));
  });
});
