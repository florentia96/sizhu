import type { FeatureEngine } from "../../app/feature";
import { numberReport } from "../_shared/numerology";

export const engine: FeatureEngine = {
  build(vals: string[]) {
    return numberReport(vals[0] ?? "", "เบอร์โทร", "數");
  },
};
