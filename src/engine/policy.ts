// [Tier 2] Interpretation policy - heuristics that are "tunable per school", kept separate from the fixed rules in constants.ts
// Where an expert can tune yongshen (favorable element) / weights / zi-hour school without touching the calculation logic
import type { ElementTH, StrengthLevel } from "../types";
import { GEN, CTRL } from "./constants";

// Zi-hour school: late = day changes at midnight (wanzishi) - early = day shifts from 23:00 (zaozishi)
export const ZI_SCHOOL: "late" | "early" = "late";

// Use true solar time for hour-pillar selection as the default (more correct per the classics)
export const USE_SOLAR_DEFAULT = true;

// Luck-pillar (DaYun) start age: days from birth to the relevant solar term / this value = number of years (3 days = 1 year rule)
export const LUCK_DAYS_PER_YEAR = 3;

// Strength thresholds from the support/(support+drain) ratio
export const STRENGTH_THRESHOLDS = { strong: 0.46, balanced: 0.36 } as const;

// Weights for the strong/weak assessment (month branch deling = "in season" weighs most)
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

// Approximate yongshen/jishen (favorable/unfavorable element) from (strength level x day-master element)
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
