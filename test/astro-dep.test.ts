import { describe, it, expect } from "vitest";
import * as Astronomy from "astronomy-engine";

describe("F4.1 astronomy-engine dependency", () => {
  it("exposes the geocentric ephemeris API + Body enum + AstroTime", () => {
    // NOTE: EclipticLongitude is HELIOCENTRIC (throws for Body.Sun); the geocentric
    // tropical-chart longitudes used by src/astro/ephemeris.ts come from these:
    expect(typeof Astronomy.SunPosition).toBe("function");
    expect(typeof Astronomy.EclipticGeoMoon).toBe("function");
    expect(typeof Astronomy.GeoVector).toBe("function");
    expect(typeof Astronomy.Ecliptic).toBe("function");
    expect(Astronomy.Body.Sun).toBeDefined();
    expect(Astronomy.Body.Moon).toBeDefined();
    expect(typeof Astronomy.AstroTime).toBe("function");
  });

  it("computes the Sun geocentric ecliptic longitude at J2000 noon (~280.4°)", () => {
    // J2000.0 = 2000-01-01 12:00 ≈ Date.UTC(2000,0,1,12). Geocentric Sun lon ~ 280.4°.
    const t = new Astronomy.AstroTime(new Date(Date.UTC(2000, 0, 1, 12, 0, 0)));
    const lon = Astronomy.SunPosition(t).elon;
    expect(lon).toBeGreaterThan(278);
    expect(lon).toBeLessThan(283);
  });
});
