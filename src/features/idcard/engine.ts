import type { FeatureEngine } from "../../app/feature";
import { numberReport } from "../_shared/numerology";

export const idcardEngine: FeatureEngine = {
  build(vals: string[]) {
    return numberReport(vals[1] || vals[0] || "", "เลข", "證");
  },
};
