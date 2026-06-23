import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";

// bazi uses the full page (#/bazi), not the detail layout - this engine is a teaser guarding against direct build() calls
export const baziEngine: FeatureEngine = {
  build(): Section[] {
    return [
      {
        kind: "note",
        text: "ปาจื้อเปิดในหน้าเต็มเฉพาะของศาสตร์นี้ — แตะการ์ดเพื่อไปยังหน้าเปิดดวงสี่เสา",
      },
    ];
  },
};
