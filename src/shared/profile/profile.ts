import type { Field } from "../../app/feature";

export interface Profile {
  birthDate?: string; // yyyy-mm-dd from input[type=date]
  birthTime?: string; // hh:mm
  city?: string; // CityField value ("name|lat|lon|tz" or a city name)
  gender?: string; // gender stored in Thai (male/female) to match the sex select's options (kua/namesuggest)
}

export type ProfileSlot = keyof Profile;

const KEY = "moodee.profile.v1";

function storage(): Storage | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadProfile(): Profile {
  const s = storage();
  if (!s) return {};
  try {
    const raw = s.getItem(KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw) as unknown;
    return obj && typeof obj === "object" ? (obj as Profile) : {};
  } catch {
    return {};
  }
}

export function saveProfile(p: Profile): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(KEY, JSON.stringify(p));
  } catch {
    /* quota/private mode - stay silent */
  }
}

/** Merge only non-empty values into the existing profile, save, and return the latest profile */
export function patchProfile(patch: Partial<Profile>): Profile {
  const next: Profile = { ...loadProfile() };
  for (const [k, v] of Object.entries(patch)) {
    if (typeof v === "string" && v.trim()) next[k as ProfileSlot] = v;
  }
  saveProfile(next);
  return next;
}

export function clearProfile(): void {
  const s = storage();
  if (!s) return;
  try {
    s.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** Whether there is at least one autofillable field */
export function hasProfile(p: Profile = loadProfile()): boolean {
  return Boolean(p.birthDate || p.birthTime || p.city || p.gender);
}

/**
 * Whether the core data is complete enough to open a discipline one-tap - needs birth date + sex
 * (birth time optional: if unset, disciplines needing it will ask on the feature page)
 */
export function hasCoreProfile(p: Profile = loadProfile()): boolean {
  return Boolean(p.birthDate && p.gender);
}

/**
 * Match a field to a profile slot - used both during autofill and saving
 * Specific enough not to catch other date fields (e.g. auspicious timing) or the day-of-week select in lucky color
 */
export function slotForField(field: Field): ProfileSlot | null {
  if (field.type === "date" && field.label.includes("วันเกิด")) return "birthDate";
  if (field.type === "time" && field.label.includes("เกิด")) return "birthTime";
  if (field.type === "city") return "city";
  return null;
}
