import type { FeatureMeta, Field } from "../../app/feature";

export const compatMeta: FeatureMeta = {
  id: "compat",
  name: "ดวงสมพงษ์ (Compatibility)",
  cn: "緣",
  desc: "ประเมินความเข้ากันจากธาตุราศี ผู้ครองวัน เลขชีวิต (+ ดวงสมพงษ์ดาวจริงถ้ามีเวลา/เมือง)",
  long: "ประเมินความเข้ากันของสองคนจากธาตุราศี ผู้ครองวันเกิด และเลขชีวิต (deterministic) หากระบุเวลาและเมืองเกิดครบทั้งสองฝ่าย จะเพิ่มชั้นดวงสมพงษ์ (synastry) จากมุมสัมพันธ์ของดาวจริงทั้งสองดวง",
};

// 0,1 = วันเกิด (จำเป็น); 2-5 = เวลา/เมือง (ไม่บังคับ — ใส่ครบเพื่อปลดล็อก synastry)
export const compatFields: Field[] = [
  { label: "คนที่ 1 — วันเกิด", type: "date" },
  { label: "คนที่ 2 — วันเกิด", type: "date" },
  { label: "คนที่ 1 — เวลาเกิด (ถ้ามี)", type: "time" },
  { label: "คนที่ 1 — เมืองเกิด (ถ้ามี)", type: "city" },
  { label: "คนที่ 2 — เวลาเกิด (ถ้ามี)", type: "time" },
  { label: "คนที่ 2 — เมืองเกิด (ถ้ามี)", type: "city" },
];
