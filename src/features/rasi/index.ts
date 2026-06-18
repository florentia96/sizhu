import type { FeatureDef, FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { rasiMeta } from "./meta";
import { rasiFields } from "./fields";
import { rasiReport } from "./engine";

function dparts(s: string): { y: number; m: number; d: number } {
  const p = (s || "").split("-").map(Number);
  return { y: p[0], m: p[1], d: p[2] };
}

const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const { y, m, d } = dparts(vals[0]);
    return rasiReport(y, m, d);
  },
};

export const def: FeatureDef = {
  meta: rasiMeta,
  group: "daily",
  fields: rasiFields,
  engine,
};

export const rasiFeature = def;
