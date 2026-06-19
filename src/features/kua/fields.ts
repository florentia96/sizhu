import type { Field } from "../../app/feature";

export const fields: Field[] = [
  {
    label: "ปีเกิด (พ.ศ. หรือ ค.ศ.)",
    type: "text",
    placeholder: "เช่น 2535",
    inputMode: "numeric",
    maxLength: 4,
    hint: "พ.ศ. หรือ ค.ศ. ก็ได้ ระบบปรับให้อัตโนมัติ",
  },
  { label: "เพศ", type: "select", options: ["ชาย", "หญิง"] },
  {
    label: "วันเกิด (ถ้าทราบ — ช่วยปรับรอบปีช่วงต้น ก.พ.)",
    type: "date",
    hint: "ใส่เมื่อเกิดต้นปี (ม.ค.–ต้น ก.พ.) เพราะรอบปีเปลี่ยนราว 4 ก.พ. ไม่ใช่ 1 ม.ค.",
  },
];
