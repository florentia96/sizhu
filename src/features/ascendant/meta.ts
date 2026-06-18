import type { FeatureMeta, Field } from "../../app/feature";

export const ascMeta: FeatureMeta = {
  id: "ascendant",
  name: "ลัคนา & ราศีจันทร์",
  cn: "昇",
  desc: "หาลัคนา ราศีอาทิตย์ และราศีจันทร์จริง จากเวลา-สถานที่เกิด",
  long: "คำนวณลัคนา (ราศีที่ขึ้นขอบฟ้าตะวันออกตอนเกิด) ราศีอาทิตย์ และราศีจันทร์จากตำแหน่งดวงจันทร์จริง พร้อมลัคนาแบบโหราไทย (sidereal/Lahiri ayanamsa) ต้องใช้ วันเกิด เวลาเกิดที่แม่นยำ และเมืองเกิด เพราะลัคนาเปลี่ยนทุก ~2 ชั่วโมง",
};

export const ascFields: Field[] = [
  { label: "วันเกิด", type: "date" },
  { label: "เวลาเกิด", type: "time" },
  { label: "เมืองเกิด", type: "city" },
];
