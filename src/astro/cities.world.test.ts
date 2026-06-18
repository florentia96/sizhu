import { describe, it, expect } from "vitest";
import { CITY, findCity } from "./cities";

describe("F4.8 cities — world subset", () => {
  it("includes non-tz-7 world cities", () => {
    const world = CITY.filter((c) => c.tz !== 7);
    expect(world.length).toBeGreaterThanOrEqual(20);
  });

  it("findCity('London') ≈ 51.5 / -0.13 / tz 0", () => {
    const c = findCity("London");
    expect(c).not.toBeNull();
    expect(Math.abs(c!.lat - 51.5)).toBeLessThan(0.3);
    expect(Math.abs(c!.lon - -0.13)).toBeLessThan(0.3);
    expect(c!.tz).toBe(0);
  });

  it("findCity('Tokyo') has tz +9 and positive lon", () => {
    const c = findCity("Tokyo");
    expect(c).not.toBeNull();
    expect(c!.tz).toBe(9);
    expect(c!.lon).toBeGreaterThan(135);
  });

  it("findCity('New York') has negative lon and tz -5", () => {
    const c = findCity("New York");
    expect(c).not.toBeNull();
    expect(c!.lon).toBeLessThan(0);
    expect(c!.tz).toBe(-5);
  });

  it("Thai provinces still resolve after merge (no regression)", () => {
    expect(findCity("Bangkok")?.tz).toBe(7);
    expect(CITY.filter((c) => c.tz === 7).length).toBeGreaterThanOrEqual(77);
  });
});
