import type { Field } from "../../app/feature";

export interface Profile {
  birthDate?: string; // yyyy-mm-dd จาก input[type=date]
  birthTime?: string; // hh:mm
  city?: string; // ค่า CityField ("ชื่อ|lat|lon|tz" หรือชื่อเมือง)
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
    /* quota/private mode — เงียบไว้ */
  }
}

/** รวมเฉพาะค่าที่ไม่ว่างเข้ากับโปรไฟล์เดิม แล้วบันทึก คืนค่าโปรไฟล์ล่าสุด */
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

/** มีข้อมูลที่ autofill ได้อย่างน้อยหนึ่งช่องไหม */
export function hasProfile(p: Profile = loadProfile()): boolean {
  return Boolean(p.birthDate || p.birthTime || p.city);
}

/**
 * จับคู่ field กับช่องโปรไฟล์ — ใช้ทั้งตอน autofill และตอนบันทึก
 * เจาะจงพอที่จะไม่ไปโดน field วันที่อื่น (เช่น ฤกษ์ยาม) หรือ select วันในสัปดาห์ของสีมงคล
 */
export function slotForField(field: Field): ProfileSlot | null {
  if (field.type === "date" && field.label.includes("วันเกิด")) return "birthDate";
  if (field.type === "time" && field.label.includes("เกิด")) return "birthTime";
  if (field.type === "city") return "city";
  return null;
}
