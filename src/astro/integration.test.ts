import { describe, it, expect } from "vitest";
import { findCity } from "./cities";
import { bodyPositions, BODIES } from "./ephemeris";
import { ascendant, placidusCusps, thaiLagna } from "./houses";
import { aspectsBetween } from "./aspects";
import { julianDay } from "../engine/astro";

describe("F4.9 astro module integration", () => {
  it("city → jdUT → full natal pipeline interlocks", () => {
    const city = findCity("Bangkok");
    expect(city).not.toBeNull();
    // 1990-07-15 05:30 local; UT = local - tz.
    const jdUT = julianDay(1990, 7, 15, 5.5 - city!.tz);
    const inp = { jdUT, lat: city!.lat, lon: city!.lon };

    const planets = bodyPositions(jdUT);
    expect(Object.keys(planets).length).toBe(7);

    const asc = ascendant(inp);
    expect(asc.deg).toBeGreaterThanOrEqual(0);
    expect(asc.deg).toBeLessThan(360);

    const cusps = placidusCusps(inp);
    expect(cusps.length).toBe(12);
    expect(Math.abs((((cusps[0] - asc.deg) % 360) + 360) % 360)).toBeLessThan(1e-6);

    const lagna = thaiLagna(inp);
    expect(lagna.deg).toBeGreaterThanOrEqual(0);
    expect(lagna.deg).toBeLessThan(30);

    // natal aspects = planets against themselves
    const lons: Record<string, number> = {};
    for (const b of BODIES) lons[b] = planets[b].lon;
    const asp = aspectsBetween(lons, lons);
    // every body conjuncts itself (orb 0) -> at least 7 conjunctions
    expect(asp.filter((a) => a.a === a.b && a.type === "conjunction").length).toBe(7);
  });

  it("whole pipeline is deterministic", () => {
    const inp = { jdUT: 2451545.0, lat: 13.75, lon: 100.5 };
    const a = {
      planets: bodyPositions(inp.jdUT),
      asc: ascendant(inp),
      cusps: placidusCusps(inp),
      lagna: thaiLagna(inp),
    };
    const b = {
      planets: bodyPositions(inp.jdUT),
      asc: ascendant(inp),
      cusps: placidusCusps(inp),
      lagna: thaiLagna(inp),
    };
    expect(a).toEqual(b);
  });
});
