import { eclipticLongitude } from "../../astro/ephemeris";
import { jdnNoon } from "../../engine/astro";

export const AYANAMSA = 24.1;

const SIDEREAL_ORDER = [
  "เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์",
  "ตุล", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน",
];

function normYear(y: number): number {
  return y > 2300 ? y - 543 : y;
}

export function siderealSunSign(
  y: number,
  m: number,
  d: number,
): { rasi: string; lonSidereal: number } {
  const Y = normYear(y);
  const jd = jdnNoon(Y, m, d);
  const trop = eclipticLongitude("Sun", jd);
  const lonSidereal = (((trop - AYANAMSA) % 360) + 360) % 360;
  const idx = Math.floor(lonSidereal / 30) % 12;
  return { rasi: SIDEREAL_ORDER[idx], lonSidereal };
}

export function siderealCell(
  y: number,
  m: number,
  d: number,
): { name: string; value: string; note: string } {
  const s = siderealSunSign(y, m, d);
  return {
    name: "ราศีตามดาวจริง (sidereal)",
    value: "ราศี" + s.rasi,
    note: "ตำแหน่งอาทิตย์จริง − อายนางศะ Lahiri ≈ 24.1°",
  };
}
