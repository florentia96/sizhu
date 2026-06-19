import type { FeatureDef, FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { dreamMeta } from "./meta";
import { dreamFields } from "./fields";
import { dreamReport } from "./engine";

const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return dreamReport(vals[0] || "");
  },
};

export const def: FeatureDef = {
  meta: dreamMeta,
  group: "daily",
  fields: dreamFields,
  engine,
};

export const dreamFeature = def;
