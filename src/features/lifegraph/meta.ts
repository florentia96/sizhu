import type { FeatureMeta, Field } from "../../app/feature";
import { SCOPE_OPTIONS } from "./content";

export const lifeMeta: FeatureMeta = {
  id: "lifegraph",
  name: "กราฟชีวิต (ดาวจร + ปีส่วนตัว)",
  cn: "運",
  desc: "ดาวจร (transit) จริงเทียบดวงเดิม + ปีส่วนตัวเลขศาสตร์",
  long: "อ่านจังหวะชีวิตช่วงนี้จากดาวจร (transit) จริงที่ทำมุมกับดาวในดวงกำเนิด ผสานกับชั้นเลขศาสตร์ (Life Path / Personal Year) ต้องใช้ วันเกิด เวลาเกิด เมืองเกิด และ 'ณ วันที่' ที่ต้องการดู (ระบบฉีดวันนี้ให้อัตโนมัติ ปรับได้)",
};

export const lifeFields: Field[] = [
  { label: "วันเกิด", type: "date" },
  { label: "เวลาเกิด", type: "time" },
  { label: "เมืองเกิด", type: "city" },
  { label: "ช่วงที่อยากเน้น", type: "select", options: SCOPE_OPTIONS },
  { label: "ณ วันที่ (เว้นว่าง = วันนี้)", type: "date" },
];
