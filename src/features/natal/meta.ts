import type { FeatureMeta, Field } from "../../app/feature";

export const natalMeta: FeatureMeta = {
  id: "natal",
  name: "ดวงกำเนิด (Natal Chart)",
  cn: "盤",
  desc: "ผูกดวงตะวันตกจากดาวจริง — ตำแหน่งดาวในราศี/เรือน + มุมสัมพันธ์",
  long: "ผูกดวงกำเนิดแบบโหราศาสตร์ตะวันตก (tropical zodiac + เรือนแบบ Placidus) จากตำแหน่งดาวจริงด้วยปฏิทินดาราศาสตร์ ระบุดาวพระเคราะห์ในราศีและเรือนชะตา ลัคนา และมุมสัมพันธ์ (aspects) ที่สำคัญ ต้องใช้ วันเกิด เวลาเกิด และเมืองเกิด เพื่อความแม่นยำ",
};

export const natalFields: Field[] = [
  { label: "วันเกิด", type: "date" },
  { label: "เวลาเกิด", type: "time" },
  { label: "เมืองเกิด", type: "city" },
];
