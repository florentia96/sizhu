// kala-yok: thongchai/athibodi/ubat/lokawinat days + dithi (lunar phase)
// kala-yok formula from the Chula Sakarat (CS) era - sources:
//   th.wikipedia.org Thai article on kala-yok + topicstock.pantip.com/.../Y10182445
//   cross-checked with Hora Rattanakosin BE 2568 (horoscope.kapook.com/view289786.html)
// dithi = lunar age from the mean synodic month of 29.530588853 days (NASA mean lunation)

export type KalaClass = "ธงชัย" | "อธิบดี" | "อุบาทว์" | "โลกาวินาศ";

/** Gregorian -> Julian Day Number (proleptic Gregorian, noon-based) */
export function gregorianToJDN(y: number, m: number, d: number): number {
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

/**
 * Chula Sakarat (CS) for the given CE month/year
 * CS = BE - 1181 = (CE + 543) - 1181 = CE - 638
 * CS rolls over around Songkran - Jan-Mar is still the previous CS year
 * Assumption (NO MAGIC): cut at the start of April at month granularity (input is a month with no day, so the per-year astronomical Songkran is not computed)
 */
export function chulaSakaratForMonth(yearCE: number, month: number): number {
  const base = yearCE - 638;
  return month < 4 ? base - 1 : base;
}

/**
 * Weekday of the 4 kala-yok (0=Sunday ... 6=Saturday)
 * Formula per the texts -> remainder mod 7 (remainder 1=Sunday ... 0=Saturday) converted to 0-based via (r+6)%7
 */
export function kalaWeekdays(cs: number): Record<KalaClass, number> {
  const toWeekday = (criterion: number): number => {
    const r = ((criterion % 7) + 7) % 7; // remainder 1..6,0 (0=Saturday)
    return (r + 6) % 7; // 1->0(Sunday) ... 0->6(Saturday)
  };
  return {
    ธงชัย: toWeekday(cs * 10 + 3),
    อธิบดี: toWeekday(((cs % 498) + 498) % 498),
    อุบาทว์: toWeekday(cs * 10 + 2),
    โลกาวินาศ: toWeekday(cs + 1120),
  };
}

const SYNODIC = 29.530588853;
// new-moon epoch: 2000-01-06 18:14 UT ~ JD 2451550.26 (NASA reference new moon)
const NEWMOON_EPOCH_JD = 2451550.26;

/**
 * dithi / lunar phase at the given JDN
 * age = moon age (0=new moon) - waxing (age<half) - dithi = the nth night (1..15 waxing/waning)
 */
export function lunarPhase(jdn: number): {
  age: number;
  waxing: boolean;
  dithi: number;
} {
  const age = (((jdn - NEWMOON_EPOCH_JD) % SYNODIC) + SYNODIC) % SYNODIC;
  const waxing = age < SYNODIC / 2;
  const dayInHalf = Math.floor(age % (SYNODIC / 2)) + 1; // 1..15
  return { age, waxing, dithi: Math.min(15, dayInHalf) };
}
