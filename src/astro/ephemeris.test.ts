import { describe, it, expect } from "vitest";
import { eclipticLongitude, bodyPositions, signFromLon, BODIES } from "./ephemeris";
import { julianDay } from "../engine/astro";

// Reference vector: Albert Einstein, 1879-03-14, 11:30 local Ulm.
// Source: astrotheme.com / astro-charts.com (Rodden AA, birth certificate).
// Sun = Pisces 23 deg 30' = 330 + 23.5 = 353.5 deg absolute ecliptic longitude.
// Ulm LMT (lon 9.9833 deg E => +0h39m56s) -> UT = 11:30 - 0:40 = 10:50 UT = 10.8333h.
// The Sun is robust to the ~13-min historical-TZ ambiguity (moves ~0.04 deg/13min).
describe("F4.2 ephemeris — Einstein Sun reference vector", () => {
  const jd = julianDay(1879, 3, 14, 10 + 50 / 60); // 10:50 UT

  it("Sun ecliptic longitude ≈ 353.5° (Pisces 23.5°), tolerance ±0.5°", () => {
    const lon = eclipticLongitude("Sun", jd);
    expect(Math.abs(lon - 353.5)).toBeLessThan(0.5);
  });

  it("Sun resolves to sign Pisces with deg ≈ 23.5", () => {
    const p = signFromLon(eclipticLongitude("Sun", jd));
    expect(p.sign).toBe("Pisces");
    expect(p.signTh).toBe("มีน");
    expect(Math.abs(p.deg - 23.5)).toBeLessThan(0.5);
  });

  it("Moon ≈ Sagittarius 14° (≈ 254°), tolerance ±2° (Moon moves fast)", () => {
    const lon = eclipticLongitude("Moon", jd);
    expect(Math.abs(lon - 254.4)).toBeLessThan(2);
  });
});

describe("F4.2 ephemeris — structure & determinism", () => {
  const jd = julianDay(2000, 1, 1, 12); // J2000 noon

  it("signFromLon maps boundaries correctly", () => {
    expect(signFromLon(0).sign).toBe("Aries");
    expect(signFromLon(0).signTh).toBe("เมษ");
    expect(signFromLon(0).deg).toBeCloseTo(0, 6);
    expect(signFromLon(359.9).sign).toBe("Pisces");
    expect(signFromLon(30).sign).toBe("Taurus");
    expect(signFromLon(353.5).sign).toBe("Pisces");
    expect(signFromLon(353.5).deg).toBeCloseTo(23.5, 6);
  });

  it("signFromLon normalizes out-of-range / negative input", () => {
    expect(signFromLon(360).sign).toBe("Aries");
    expect(signFromLon(-10).sign).toBe("Pisces");
    expect(signFromLon(-10).deg).toBeCloseTo(20, 6);
  });

  it("eclipticLongitude returns 0..360 for every body", () => {
    for (const b of BODIES) {
      const lon = eclipticLongitude(b, jd);
      expect(lon).toBeGreaterThanOrEqual(0);
      expect(lon).toBeLessThan(360);
    }
  });

  it("bodyPositions covers all 7 bodies and is deterministic", () => {
    const a = bodyPositions(jd);
    const b = bodyPositions(jd);
    for (const body of BODIES) {
      expect(a[body].lon).toBe(b[body].lon);
      expect(a[body].sign).toBe(b[body].sign);
      expect(a[body].deg).toBeGreaterThanOrEqual(0);
      expect(a[body].deg).toBeLessThan(30);
    }
    expect(Object.keys(a).length).toBe(7);
  });
});
