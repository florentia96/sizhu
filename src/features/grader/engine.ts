import type { FeatureEngine } from "../../app/feature";
import { numberReport } from "../_shared/numerology";

export const graderEngine: FeatureEngine = {
  build(vals: string[]) {
    const raw = vals[0] || "";
    if (raw.replace(/\D/g, "").length > 15)
      return [{ kind: "note", text: "เลขรองรับสูงสุด 15 หลัก กรุณาตรวจสอบอีกครั้ง" }];
    return numberReport(raw, "เลข", "數");
  },
};
