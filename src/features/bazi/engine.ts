import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";

// bazi ใช้หน้าเต็ม (#/bazi) ไม่ผ่าน detail layout — engine นี้เป็น teaser กันคนหลุดมาเรียก build ตรง ๆ
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
