// Astronomy: Sun position (Meeus low precision) + solar terms + Julian Day + equation of time
// Pure, no dependencies - results match sxtwl (verified in test/pillars.test.ts)

const rad = Math.PI / 180;

// Julian Day (UT) from the Gregorian calendar date + UT hour
export function julianDay(y: number, m: number, d: number, hourUT: number): number {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    B -
    1524.5 +
    hourUT / 24
  );
}

// Julian Day Number at noon (for the day pillar) from a calendar date
export function jdnNoon(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

// Apparent ecliptic longitude of the Sun (degrees) - Meeus low precision (~0.01 deg)
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mr = M * rad;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);
  const trueLong = L0 + C;
  const Omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(Omega * rad);
  return ((lambda % 360) + 360) % 360;
}

// Find the JD where the Sun is at longitude target, near guessJD (bisection)
export function solarTermJD(target: number, guessJD: number): number {
  const f = (jd: number): number => {
    let diff = sunLongitude(jd) - target;
    diff = (((diff + 180) % 360) + 360) % 360 - 180;
    return diff;
  };
  let lo = guessJD - 3;
  let hi = guessJD + 3;
  let flo = f(lo);
  let fhi = f(hi);
  let tries = 0;
  while (flo * fhi > 0 && tries < 10) {
    lo -= 3;
    hi += 3;
    flo = f(lo);
    fhi = f(hi);
    tries++;
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (flo * fm <= 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  return (lo + hi) / 2;
}

// Equation of time (minutes) - NOAA approximation, verified in test/solar.test.ts (this part is not covered by sxtwl)
export function equationOfTime(y: number, m: number, d: number): number {
  const start = julianDay(y, 1, 1, 0) - 0.5;
  const n = Math.floor(julianDay(y, m, d, 0) - 0.5 - start) + 1;
  const B = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}
