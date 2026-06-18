import type { FeatureDef, FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { birthdayMeta } from "./meta";
import { birthdayFields } from "./fields";
import { birthdayReport } from "./engine";

function dparts(s: string): { y: number; m: number; d: number } {
  const p = (s || "").split("-").map(Number);
  return { y: p[0], m: p[1], d: p[2] };
}

const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const { y, m, d } = dparts(vals[0]);
    const nowYear = new Date().getFullYear();
    return birthdayReport(y, m, d, nowYear);
  },
};

export const def: FeatureDef = {
  meta: birthdayMeta,
  group: "daily",
  fields: birthdayFields,
  engine,
};

export const birthdayFeature = def;
