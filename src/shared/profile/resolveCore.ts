import type { Field } from "../../app/feature";
import type { Profile } from "./profile";

// Sunday=0 ... Saturday=6 (matches Date.getUTCDay)
const WEEKDAY_TH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"] as const;

/** Extract the CE year (string) from birthDate "YYYY-MM-DD" - the engine's toCE already handles BE/CE */
export function yearFromBirthDate(birthDate: string): string | null {
  const m = /^(\d{3,4})-\d{2}-\d{2}$/.exec(birthDate);
  return m ? m[1] : null;
}

/**
 * Convert birthDate (+ birthTime) to a weekday label matching the taksa select's options
 * Wednesday splits into day/night at 18:00 (per taksa, the Rahu base) - if the time is unknown, treat as daytime
 */
export function weekdayFromBirthDate(birthDate: string, birthTime?: string): string | null {
  const m = /^(\d{3,4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return null;
  let y = Number(m[1]);
  if (y > 2300) y -= 543; // in case of BE (home uses input[type=date] = CE already)
  const dow = new Date(Date.UTC(y, Number(m[2]) - 1, Number(m[3]))).getUTCDay();
  if (dow === 3) {
    const hh = birthTime && /^\d{2}:/.test(birthTime) ? Number(birthTime.slice(0, 2)) : 12;
    return hh >= 18 ? "พุธ (กลางคืน)" : "พุธ (กลางวัน)";
  }
  return WEEKDAY_TH[dow];
}

/**
 * Return the core value for a given field from the profile (birth date/time/sex/city + derived year/weekday)
 * null = this field is not a core field, or there is no data yet -> must be entered in the feature's mini-form
 * Preserves the existing contract: engine.build(vals) needs no change, we just fill in the field positions
 */
export function resolveCoreValue(field: Field, profile: Profile): string | null {
  if (field.partner) return null;
  const label = field.label;

  if (field.type === "date" && label.includes("วันเกิด")) {
    return profile.birthDate ?? null;
  }
  if (field.type === "time" && label.includes("เกิด")) {
    return profile.birthTime ?? null;
  }
  if (field.type === "city") {
    return profile.city ?? null;
  }
  if (field.type === "select" && label.includes("เพศ")) {
    return profile.gender ?? null;
  }
  // DERIVE-YEAR: the text "year of birth" field (kua, zodiacyear) - toCE handles BE/CE
  if (field.type === "text" && label.includes("ปีเกิด")) {
    return profile.birthDate ? yearFromBirthDate(profile.birthDate) : null;
  }
  // DERIVE-WEEKDAY: a weekday select whose label contains "birth day" (kalakini, luckycolor, nameanalyze)
  if (field.type === "select" && label.includes("วันเกิด")) {
    return profile.birthDate ? weekdayFromBirthDate(profile.birthDate, profile.birthTime) : null;
  }
  return null;
}

/** Positions of fields the user must still enter on the feature page (cannot be resolved) */
export function extraFieldIndexes(fields: Field[], profile: Profile): number[] {
  return fields.map((f, i) => (resolveCoreValue(f, profile) === null ? i : -1)).filter((i) => i >= 0);
}

/**
 * Is this field core data that must be entered on the home page (birth date/time/sex + derived year/weekday)?
 * Excludes city of birth (collected on the feature page) - used to decide whether a birth date must be entered before opening a discipline
 */
export function isCoreField(field: Field): boolean {
  if (field.partner) return false;
  const l = field.label;
  if (field.type === "date" && l.includes("วันเกิด")) return true;
  if (field.type === "time" && l.includes("เกิด")) return true;
  if (field.type === "select" && l.includes("เพศ")) return true;
  if (field.type === "text" && l.includes("ปีเกิด")) return true;
  if (field.type === "select" && l.includes("วันเกิด")) return true;
  return false;
}

/** Does this discipline use core data (birth date etc.)? If so, a core profile is required before opening */
export function featureUsesCore(fields: Field[]): boolean {
  return fields.some(isCoreField);
}
