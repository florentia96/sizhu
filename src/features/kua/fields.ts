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
    label: "วันเกิด (ถ้าทราบ — ช่วยปรับช่วงตรุษจีน)",
    type: "date",
    hint: "ใส่เมื่อเกิดต้นปี (ม.ค.–ก.พ.) เพื่อปรับช่วงตรุษจีน",
  },
];
