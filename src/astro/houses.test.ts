import { describe, it, expect } from "vitest";
import { gmst, obliquity, lstDeg, ascendant, midheaven } from "./houses";
import { julianDay } from "../engine/astro";

describe("F4.3 houses — constant sanity values", () => {
  it("GMST at J2000.0 (JD 2451545.0) ≈ 280.4606°", () => {
    expect(Math.abs(gmst(2451545.0) - 280.4606)).toBeLessThan(0.001);
  });

  it("mean obliquity at J2000.0 ≈ 23.4393°", () => {
    expect(Math.abs(obliquity(2451545.0) - 23.4393)).toBeLessThan(0.0005);
  });

  it("GMST is 0..360", () => {
    const g = gmst(julianDay(2024, 6, 21, 6));
    expect(g).toBeGreaterThanOrEqual(0);
    expect(g).toBeLessThan(360);
  });

  it("lstDeg adds geographic longitude to GMST (mod 360)", () => {
    const jd = 2451545.0;
    const expected = (((gmst(jd) + 100.5) % 360) + 360) % 360;
    expect(Math.abs(lstDeg(jd, 100.5) - expected)).toBeLessThan(1e-9);
  });
});

describe("F4.3 houses — Einstein ascendant reference vector", () => {
  // Albert Einstein 1879-03-14, Ulm (lat 48.40 deg N, lon 9.98 deg E).
  // Birth 11:30 LMT; Ulm lon 9.9833 deg E => LMT offset +0h39m56s => UT = 10:50:04 ~ 10.8345h.
  // Reference Ascendant: Cancer (~8 deg 43' - 11 deg 38' across sources). Sign is the gate;
  // degree tolerance widened from spec +-1 deg to +-3 deg because of historical-TZ input
  // uncertainty (no standard zone in 1879 Ulm - ~13 min => ~3 deg of ascendant).
  const jd = julianDay(1879, 3, 14, 10 + 50 / 60 + 4 / 3600);
  const lat = 48.4;
  const lon = 9.9833;

  it("ascendant sign is Cancer (quadrant convention correct, no 180° flip)", () => {
    const asc = ascendant({ jdUT: jd, lat, lon });
    expect(asc.sign).toBe("Cancer");
  });

  it("ascendant degree within ±3° of Cancer ~10° (≈ 100° absolute)", () => {
    const asc = ascendant({ jdUT: jd, lat, lon });
    // Cancer is index 3 => absolute 90..120. Use ~10 deg within sign => 100 deg.
    expect(Math.abs(asc.deg - 100)).toBeLessThan(3);
  });

  it("midheaven returns a valid 0..360 longitude with a sign", () => {
    const mc = midheaven({ jdUT: jd, lat, lon });
    expect(mc.deg).toBeGreaterThanOrEqual(0);
    expect(mc.deg).toBeLessThan(360);
    expect(typeof mc.sign).toBe("string");
  });
});

describe("F4.3 houses — determinism", () => {
  it("ascendant is deterministic for same input", () => {
    const inp = { jdUT: 2451545.0, lat: 13.75, lon: 100.5 };
    expect(ascendant(inp).deg).toBe(ascendant(inp).deg);
  });
});
