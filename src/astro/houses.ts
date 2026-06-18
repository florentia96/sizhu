import { signFromLon } from "./ephemeris";

const DEG = Math.PI / 180;
const norm360 = (x: number): number => ((x % 360) + 360) % 360;

// Greenwich Mean Sidereal Time (degrees) — Meeus single-JD form.
export function gmst(jdUT: number): number {
  const d = jdUT - 2451545.0;
  const T = d / 36525.0;
  const theta =
    280.46061837 +
    360.98564736629 * d +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return norm360(theta);
}

// Mean obliquity of the ecliptic (degrees) — Meeus.
export function obliquity(jdUT: number): number {
  const T = (jdUT - 2451545.0) / 36525.0;
  return (
    23.43929111 -
    0.0130041667 * T -
    1.6388889e-7 * T * T +
    5.036111e-7 * T * T * T
  );
}

// Local Sidereal Time (degrees). lon = geographic longitude, east positive.
export function lstDeg(jdUT: number, lon: number): number {
  return norm360(gmst(jdUT) + lon);
}

export function ascendant(input: {
  jdUT: number;
  lat: number;
  lon: number;
}): { deg: number; sign: string } {
  const ramc = lstDeg(input.jdUT, input.lon) * DEG;
  const eps = obliquity(input.jdUT) * DEG;
  const phi = input.lat * DEG;
  // Asc = atan2( cos RAMC, -(sin RAMC·cos ε + tan φ·sin ε) )
  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  const deg = norm360(Math.atan2(y, x) / DEG);
  return { deg, sign: signFromLon(deg).sign };
}

export function midheaven(input: {
  jdUT: number;
  lat: number;
  lon: number;
}): { deg: number; sign: string } {
  const ramcDeg = lstDeg(input.jdUT, input.lon);
  const ramc = ramcDeg * DEG;
  const eps = obliquity(input.jdUT) * DEG;
  // MC = atan2( tan RAMC, cos ε ), placed in same hemisphere as RAMC.
  let mc = norm360(Math.atan2(Math.tan(ramc), Math.cos(eps)) / DEG);
  // Keep MC within ±90° of RAMC longitude (same culminating hemisphere).
  const diff = norm360(mc - ramcDeg);
  if (diff > 90 && diff < 270) mc = norm360(mc + 180);
  return { deg: mc, sign: signFromLon(mc).sign };
}

// --- Placidus house cusps ---

// Convert a right ascension (deg) on the ecliptic back to ecliptic longitude (deg).
// Inverse of the standard λ→RA map (RA = atan2(sin λ·cos ε, cos λ)):
//   λ = atan2(sin RA, cos RA · cos ε).
function eclipticFromRa(raDeg: number, epsRad: number): number {
  const ra = raDeg * DEG;
  const lon = Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(epsRad));
  return norm360(lon / DEG);
}

// Solve one intermediate Placidus cusp by fixed-point iteration.
// houseOffsetDeg = RA offset of the house from RAMC; f = semi-arc fraction.
function placidusIntermediate(
  ramcDeg: number,
  epsRad: number,
  latRad: number,
  houseOffsetDeg: number,
  f: number,
): number {
  const targetRa = norm360(ramcDeg + houseOffsetDeg);
  let ra = targetRa; // initial guess: the equal-RA position
  for (let i = 0; i < 50; i++) {
    // ecliptic longitude at this RA, then its declination
    const lonDeg = eclipticFromRa(ra, epsRad);
    const lon = lonDeg * DEG;
    const dec = Math.asin(Math.sin(epsRad) * Math.sin(lon)); // δ
    // ascensional difference contribution
    const ad = Math.asin(Math.tan(latRad) * Math.tan(dec)); // radians
    const next = norm360(targetRa + f * (ad / DEG));
    if (Math.abs(((next - ra + 540) % 360) - 180) < 1e-9) {
      ra = next;
      break;
    }
    ra = next;
  }
  return eclipticFromRa(ra, epsRad);
}

export function placidusCusps(input: {
  jdUT: number;
  lat: number;
  lon: number;
}): number[] {
  const epsRad = obliquity(input.jdUT) * DEG;
  const latRad = input.lat * DEG;
  const ramcDeg = lstDeg(input.jdUT, input.lon);

  const asc = ascendant(input).deg;
  const mc = midheaven(input).deg;

  // Houses 11,12 (above horizon, east of MC) and 2,3 (below).
  const c11 = placidusIntermediate(ramcDeg, epsRad, latRad, 30, 1 / 3);
  const c12 = placidusIntermediate(ramcDeg, epsRad, latRad, 60, 2 / 3);
  const c2 = placidusIntermediate(ramcDeg, epsRad, latRad, 120, 2 / 3);
  const c3 = placidusIntermediate(ramcDeg, epsRad, latRad, 150, 1 / 3);

  const cusps: number[] = new Array(12);
  cusps[0] = asc; // house 1
  cusps[1] = c2; // house 2
  cusps[2] = c3; // house 3
  cusps[3] = norm360(mc + 180); // house 4 (IC)
  cusps[4] = norm360(c11 + 180); // house 5 (opp 11)
  cusps[5] = norm360(c12 + 180); // house 6 (opp 12)
  cusps[6] = norm360(asc + 180); // house 7 (DSC)
  cusps[7] = norm360(c2 + 180); // house 8
  cusps[8] = norm360(c3 + 180); // house 9
  cusps[9] = mc; // house 10 (MC)
  cusps[10] = c11; // house 11
  cusps[11] = c12; // house 12
  return cusps;
}

// --- Lahiri ayanamsa + Thai sidereal lagna ---

// Lahiri ayanamsa (degrees). Base 23.853° at J2000.0, precessing 50.2388475″/yr.
export function lahiriAyanamsa(jdUT: number): number {
  const yearsFromJ2000 = (jdUT - 2451545.0) / 365.25;
  return 23.853 + (50.2388475 / 3600) * yearsFromJ2000;
}

export function thaiLagna(input: {
  jdUT: number;
  lat: number;
  lon: number;
}): { rasi: string; deg: number } {
  const tropical = ascendant(input).deg;
  const sidereal = (((tropical - lahiriAyanamsa(input.jdUT)) % 360) + 360) % 360;
  const s = signFromLon(sidereal);
  return { rasi: s.signTh, deg: s.deg };
}
