import type { FeatureEngine } from "../../app/feature";
import { numberReport } from "../_shared/numerology";

export const graderEngine: FeatureEngine = {
  build(vals: string[]) {
    return numberReport(vals[0] || "", "เลข", "數");
  },
};
