import { describe, it, expect } from "vitest";
import { siderealSunSign } from "./sidereal";
import { rasiAll } from "../_shared/thaiAstro";

const VALID = new Set(rasiAll().map((r) => r.s));

describe("rasi sidereal deepen", () => {
  it("returns a valid Thai rasi for a mid-sign date", () => {
    const res = siderealSunSign(1990, 5, 1);
    expect(VALID.has(res.rasi)).toBe(true);
    expect(res.lonSidereal).toBeGreaterThanOrEqual(0);
    expect(res.lonSidereal).toBeLessThan(360);
  });

  it("sidereal longitude = (tropical - Lahiri ayanamsa) wrapped to [0,360)", async () => {
    const { eclipticLongitude } = await import("../../astro/ephemeris");
    const { jdnNoon } = await import("../../engine/astro");
    const { lahiriAyanamsa } = await import("../../astro/houses");
    const jd = jdnNoon(1990, 5, 1);
    const trop = eclipticLongitude("Sun", jd);
    const expected = ((trop - lahiriAyanamsa(jd)) % 360 + 360) % 360;
    expect(Math.abs(siderealSunSign(1990, 5, 1).lonSidereal - expected)).toBeLessThan(1e-6);
  });

  it("sign index derives from floor(lonSidereal/30) over the เมษ-first order", () => {
    const res = siderealSunSign(1990, 5, 1);
    const order = ["เมษ","พฤษภ","เมถุน","กรกฎ","สิงห์","กันย์","ตุล","พิจิก","ธนู","มังกร","กุมภ์","มีน"];
    expect(res.rasi).toBe(order[Math.floor(res.lonSidereal / 30)]);
  });

  it("is deterministic", () => {
    expect(siderealSunSign(1990, 5, 1)).toEqual(siderealSunSign(1990, 5, 1));
  });
});
