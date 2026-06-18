export type Aspect = { a: string; b: string; type: string; orb: number };

export const ASPECT_ANGLES: { type: string; angle: number }[] = [
  { type: "conjunction", angle: 0 },
  { type: "sextile", angle: 60 },
  { type: "square", angle: 90 },
  { type: "trine", angle: 120 },
  { type: "opposition", angle: 180 },
];

// Shortest angular separation (0..180) between two ecliptic longitudes.
function separation(a: number, b: number): number {
  let d = (((a - b) % 360) + 360) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

export function aspectsBetween(
  a: Record<string, number>,
  b: Record<string, number>,
  orbDeg = 6,
): Aspect[] {
  const out: Aspect[] = [];
  for (const ka of Object.keys(a)) {
    for (const kb of Object.keys(b)) {
      const sep = separation(a[ka], b[kb]);
      for (const asp of ASPECT_ANGLES) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= orbDeg) {
          out.push({ a: ka, b: kb, type: asp.type, orb });
          break; // one body pair matches at most one aspect band
        }
      }
    }
  }
  return out;
}
