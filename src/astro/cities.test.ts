import { describe, it, expect } from "vitest";
import { CITY, findCity } from "./cities";

describe("F4.7 cities — Thai provinces", () => {
  it("contains all 77 Thai provinces (tz +7)", () => {
    const thai = CITY.filter((c) => c.tz === 7);
    expect(thai.length).toBeGreaterThanOrEqual(77);
  });

  it("findCity('Bangkok') ≈ 13.75 / 100.5 / tz 7", () => {
    const c = findCity("Bangkok");
    expect(c).not.toBeNull();
    expect(Math.abs(c!.lat - 13.75)).toBeLessThan(0.3);
    expect(Math.abs(c!.lon - 100.5)).toBeLessThan(0.3);
    expect(c!.tz).toBe(7);
  });

  it("findCity is case-insensitive and trim-tolerant", () => {
    expect(findCity("  bangkok  ")?.name).toBe("Bangkok");
    expect(findCity("CHIANG MAI")?.name).toBe("Chiang Mai");
  });

  it("findCity returns null for an unknown city", () => {
    expect(findCity("Atlantis")).toBeNull();
  });

  it("every Thai entry has plausible coordinates within Thailand's bounding box", () => {
    for (const c of CITY.filter((x) => x.tz === 7)) {
      expect(c.lat).toBeGreaterThan(5);
      expect(c.lat).toBeLessThan(21);
      expect(c.lon).toBeGreaterThan(97);
      expect(c.lon).toBeLessThan(106);
    }
  });
});
