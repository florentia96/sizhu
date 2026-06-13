// [ถัง 2] นโยบายการตีความ — heuristic ที่ "ปรับได้ตามสำนัก" แยกจากกฎคงที่ใน constants.ts
// จุดที่ผู้เชี่ยวชาญปรับ 用神 / น้ำหนัก / สำนักเวลาจื่อ ได้ โดยไม่แตะตรรกะคำนวณ
import type { ElementTH, StrengthLevel } from "../types";
import { GEN, CTRL } from "./constants";

// สำนักเวลาจื่อ: late = วันเปลี่ยนเที่ยงคืน (晚子時) · early = วันขยับตั้งแต่ 23:00 (早子時)
export const ZI_SCHOOL: "late" | "early" = "late";

// ปรับเป็นเวลาสุริยคติจริงเพื่อเลือกยามเป็นค่ามาตรฐาน (ถูกตามตำรามากกว่า)
export const USE_SOLAR_DEFAULT = true;

// เกณฑ์แบ่งกำลังดวงจากสัดส่วน support/(support+drain)
export const STRENGTH_THRESHOLDS = { strong: 0.46, balanced: 0.36 } as const;

// น้ำหนักในการประเมินแข็ง-อ่อน (ก้านล่างเดือน 得令 หนักสุด)
export const WEIGHTS = {
  stemMonth: 1.2,
  stemOther: 1.0,
  hiddenPrimary: 1.6,
  hiddenSecondary: 0.5,
  hiddenMonthPrimary: 3.0,
} as const;

export const STRENGTH_LABEL: Record<StrengthLevel, string> = {
  strong: "ตัวแข็ง (身強)",
  balanced: "ค่อนข้างสมดุล",
  weak: "ตัวอ่อน (身弱)",
};

export function classifyStrength(ratio: number): StrengthLevel {
  if (ratio >= STRENGTH_THRESHOLDS.strong) return "strong";
  if (ratio >= STRENGTH_THRESHOLDS.balanced) return "balanced";
  return "weak";
}

// 用神/忌神 โดยประมาณ ตาม (ระดับกำลังดวง × ธาตุประจำตัว)
export function usefulAvoid(
  level: StrengthLevel,
  dmE: ElementTH,
): { useful: ElementTH[]; avoid: ElementTH[] } {
  const elements = Object.keys(GEN) as ElementTH[];
  const resourceE = elements.find((k) => GEN[k] === dmE)!;
  const outputE = GEN[dmE];
  const wealthE = CTRL[dmE];
  const officerE = elements.find((k) => CTRL[k] === dmE)!;
  if (level === "weak") return { useful: [resourceE, dmE], avoid: [officerE, outputE] };
  if (level === "strong") return { useful: [officerE, wealthE, outputE], avoid: [resourceE, dmE] };
  return { useful: [wealthE, outputE], avoid: [resourceE] };
}
