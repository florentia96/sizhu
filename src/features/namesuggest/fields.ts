import type { Field } from "../../app/feature";

export const namesuggestFields: Field[] = [
  { label: "วันเกิด", type: "date" },
  { label: "เพศ", type: "select", options: ["หญิง", "ชาย", "ไม่ระบุ"] },
  { label: "อักษรขึ้นต้น (ไม่บังคับ)", type: "text", placeholder: "เช่น ก" },
];
