// Input guard layer before the engine - blocks NaN / impossible dates / out-of-range years / invalid sex
import type { ComputeInput, Sex } from "../types";

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

export interface RawForm {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  sex: Sex;
  tz?: string | number;
  lon?: string | number;
  useSolar?: boolean;
}

export type ValidationResult =
  | { ok: true; input: ComputeInput }
  | { ok: false; error: string };

function numOr(v: string | number | undefined, dflt: number): number | null {
  if (v === undefined || v === "") return dflt;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function validateForm(f: RawForm): ValidationResult {
  if (!f.date) return { ok: false, error: "กรุณาใส่วันเกิด" };
  const dm = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(f.date);
  if (!dm) return { ok: false, error: "รูปแบบวันเกิดไม่ถูกต้อง" };
  const year = +dm[1];
  const month = +dm[2];
  const day = +dm[3];
  if (year < MIN_YEAR || year > MAX_YEAR)
    return { ok: false, error: `รองรับปีเกิด ค.ศ. ${MIN_YEAR}–${MAX_YEAR} เท่านั้น` };
  if (month < 1 || month > 12) return { ok: false, error: "เดือนไม่ถูกต้อง" };
  const maxDay = new Date(year, month, 0).getDate(); // guards against Feb 31 / Feb 29 in a non-leap year
  if (day < 1 || day > maxDay)
    return { ok: false, error: "วันที่นี้ไม่มีอยู่จริงในเดือนที่เลือก" };

  const tm = /^(\d{1,2}):(\d{2})$/.exec(f.time || "12:00");
  if (!tm) return { ok: false, error: "รูปแบบเวลาไม่ถูกต้อง" };
  const hour = +tm[1];
  const minute = +tm[2];
  if (hour > 23 || minute > 59) return { ok: false, error: "เวลาไม่ถูกต้อง" };

  if (f.sex !== "M" && f.sex !== "F") return { ok: false, error: "กรุณาเลือกเพศ" };

  const tz = numOr(f.tz, 7);
  if (tz === null || tz < -12 || tz > 14)
    return { ok: false, error: "เขตเวลาไม่ถูกต้อง (-12 ถึง 14)" };
  const lon = numOr(f.lon, 100.5);
  if (lon === null || lon < -180 || lon > 180)
    return { ok: false, error: "ลองจิจูดไม่ถูกต้อง (-180 ถึง 180)" };

  const input: ComputeInput = { year, month, day, hour, minute, sex: f.sex, tz, lon };
  if (f.useSolar !== undefined) input.useSolar = f.useSolar;
  return { ok: true, input };
}
