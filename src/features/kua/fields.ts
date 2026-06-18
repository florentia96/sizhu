import type { Field } from "../../app/feature";

export const fields: Field[] = [
  { label: "ปีเกิด (พ.ศ. หรือ ค.ศ.)", type: "text", placeholder: "เช่น 2535" },
  { label: "เพศ", type: "select", options: ["ชาย", "หญิง"] },
  { label: "วันเกิด (ถ้าทราบ — ช่วยปรับช่วงตรุษจีน)", type: "date" },
];
