import {
  Body as AeBody,
  AstroTime,
  SunPosition,
  EclipticGeoMoon,
  GeoVector,
  Ecliptic,
} from "astronomy-engine";

export type Body =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn";

export const BODIES: Body[] = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
];

const AE_BODY: Record<Exclude<Body, "Sun" | "Moon">, AeBody> = {
  Mercury: AeBody.Mercury,
  Venus: AeBody.Venus,
  Mars: AeBody.Mars,
  Jupiter: AeBody.Jupiter,
  Saturn: AeBody.Saturn,
};

export const SIGNS_EN: string[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const SIGNS_TH: string[] = [
  "เมษ",
  "พฤษภ",
  "เมถุน",
  "กรกฎ",
  "สิงห์",
  "กันย์",
  "ตุล",
  "พิจิก",
  "ธนู",
  "มังกร",
  "กุมภ์",
  "มีน",
];

const MS_PER_DAY = 86400000;
const JD_UNIX_EPOCH = 2440587.5; // JD of 1970-01-01T00:00:00Z

function timeFromJdUT(jdUT: number): AstroTime {
  return new AstroTime(new Date((jdUT - JD_UNIX_EPOCH) * MS_PER_DAY));
}

export function signFromLon(lon: number): {
  sign: string;
  signTh: string;
  deg: number;
} {
  const norm = ((lon % 360) + 360) % 360;
  const idx = Math.floor(norm / 30) % 12;
  return { sign: SIGNS_EN[idx], signTh: SIGNS_TH[idx], deg: norm - idx * 30 };
}

// Geocentric apparent ecliptic longitude of date (tropical chart convention).
// astronomy-engine's EclipticLongitude is HELIOCENTRIC (and throws for the Sun),
// so each body is computed via its geocentric-of-date routine:
//   Sun  → SunPosition().elon       (geocentric true ecliptic of date)
//   Moon → EclipticGeoMoon().lon    (ECT — ecliptic of date)
//   else → Ecliptic(GeoVector()).elon (J2000 EQJ vector → true ecliptic of date)
export function eclipticLongitude(body: Body, jdUT: number): number {
  const t = timeFromJdUT(jdUT);
  let lon: number;
  if (body === "Sun") {
    lon = SunPosition(t).elon;
  } else if (body === "Moon") {
    lon = EclipticGeoMoon(t).lon;
  } else {
    lon = Ecliptic(GeoVector(AE_BODY[body], t, true)).elon;
  }
  return ((lon % 360) + 360) % 360;
}

export function bodyPositions(jdUT: number): Record<
  Body,
  { lon: number; sign: string; signTh: string; deg: number }
> {
  const out = {} as Record<
    Body,
    { lon: number; sign: string; signTh: string; deg: number }
  >;
  for (const b of BODIES) {
    const lon = eclipticLongitude(b, jdUT);
    const s = signFromLon(lon);
    out[b] = { lon, sign: s.sign, signTh: s.signTh, deg: s.deg };
  }
  return out;
}
