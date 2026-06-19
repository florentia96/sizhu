import type { FeatureDef, FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { luckycolorMeta } from "./meta";
import { luckycolorFields } from "./fields";
import { luckyColorReport } from "./engine";

const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return luckyColorReport(vals[0] || "", vals[1] || "");
  },
};

export const def: FeatureDef = {
  meta: luckycolorMeta,
  group: "daily",
  fields: luckycolorFields,
  engine,
};

export const luckycolorFeature = def;
