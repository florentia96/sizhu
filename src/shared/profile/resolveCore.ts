import type { Field } from "../../app/feature";
import type { Profile } from "./profile";

// อาทิตย์=0 … เสาร์=6 (ตรงกับ Date.getUTCDay)
const WEEKDAY_TH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"] as const;

// ป้าย field ของ "บุคคลที่สอง" (compat) — ไม่ดึงจาก profile ของผู้ใช้
function isSecondPerson(label: string): boolean {
  return label.includes("คนที่ 2") || label.includes("ที่ 2");
}

/** ดึงปี ค.ศ. (string) จาก birthDate "YYYY-MM-DD" — toCE ของ engine รองรับ พ.ศ./ค.ศ. อยู่แล้ว */
export function yearFromBirthDate(birthDate: string): string | null {
  const m = /^(\d{3,4})-\d{2}-\d{2}$/.exec(birthDate);
  return m ? m[1] : null;
}

/**
 * แปลง birthDate (+ birthTime) เป็นป้ายวันในสัปดาห์ตรงกับ option ของ select ทักษา
 * วันพุธแยกกลางวัน/กลางคืนที่ 18:00 (ตามตำราทักษา ฐานราหู) — ถ้าไม่ทราบเวลาถือเป็นกลางวัน
 */
export function weekdayFromBirthDate(birthDate: string, birthTime?: string): string | null {
  const m = /^(\d{3,4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return null;
  let y = Number(m[1]);
  if (y > 2300) y -= 543; // เผื่อ พ.ศ. (home ใช้ input[type=date] = ค.ศ. อยู่แล้ว)
  const dow = new Date(Date.UTC(y, Number(m[2]) - 1, Number(m[3]))).getUTCDay();
  if (dow === 3) {
    const hh = birthTime && /^\d{2}:/.test(birthTime) ? Number(birthTime.slice(0, 2)) : 12;
    return hh >= 18 ? "พุธ (กลางคืน)" : "พุธ (กลางวัน)";
  }
  return WEEKDAY_TH[dow];
}

/**
 * คืนค่าแกนสำหรับ field หนึ่ง ๆ จาก profile (วันเกิด/เวลาเกิด/เพศ/เมือง + derive ปี/วัน)
 * คืน null = field นี้ไม่ใช่แกน หรือยังไม่มีข้อมูล → ต้องกรอกใน mini-form ของ feature
 * รักษา contract เดิม: engine.build(vals) ไม่ต้องแก้ เพียงเติมตำแหน่ง field ให้ครบ
 */
export function resolveCoreValue(field: Field, profile: Profile): string | null {
  const label = field.label;

  if (field.type === "date" && label.includes("วันเกิด")) {
    return isSecondPerson(label) ? null : profile.birthDate ?? null;
  }
  if (field.type === "time" && label.includes("เกิด")) {
    return isSecondPerson(label) ? null : profile.birthTime ?? null;
  }
  if (field.type === "city") {
    return isSecondPerson(label) ? null : profile.city ?? null;
  }
  if (field.type === "select" && label.includes("เพศ")) {
    return profile.gender ?? null;
  }
  // DERIVE-YEAR: ช่อง text "ปีเกิด" (kua, zodiacyear) — toCE จัดการ พ.ศ./ค.ศ.
  if (field.type === "text" && label.includes("ปีเกิด")) {
    return profile.birthDate ? yearFromBirthDate(profile.birthDate) : null;
  }
  // DERIVE-WEEKDAY: select วันในสัปดาห์ที่ label มี "วันเกิด" (kalakini, luckycolor, nameanalyze)
  if (field.type === "select" && label.includes("วันเกิด")) {
    return profile.birthDate ? weekdayFromBirthDate(profile.birthDate, profile.birthTime) : null;
  }
  return null;
}

/** ตำแหน่ง field ที่ยังต้องให้ผู้ใช้กรอกเองในหน้า feature (resolve ไม่ได้) */
export function extraFieldIndexes(fields: Field[], profile: Profile): number[] {
  return fields.map((f, i) => (resolveCoreValue(f, profile) === null ? i : -1)).filter((i) => i >= 0);
}

/**
 * field นี้เป็นข้อมูลแกนที่ต้องกรอกที่หน้าแรกไหม (วันเกิด/เวลา/เพศ + derive ปี/วัน)
 * ไม่นับเมืองเกิด (เก็บในหน้า feature) — ใช้ตัดสินว่าควรบังคับกรอกวันเกิดก่อนเปิดศาสตร์หรือไม่
 */
export function isCoreField(field: Field): boolean {
  const l = field.label;
  if (isSecondPerson(l)) return false;
  if (field.type === "date" && l.includes("วันเกิด")) return true;
  if (field.type === "time" && l.includes("เกิด")) return true;
  if (field.type === "select" && l.includes("เพศ")) return true;
  if (field.type === "text" && l.includes("ปีเกิด")) return true;
  if (field.type === "select" && l.includes("วันเกิด")) return true;
  return false;
}

/** ศาสตร์นี้ใช้ข้อมูลแกน (วันเกิด ฯลฯ) ไหม — ถ้าใช่ ต้องมีโปรไฟล์แกนก่อนเปิด */
export function featureUsesCore(fields: Field[]): boolean {
  return fields.some(isCoreField);
}
