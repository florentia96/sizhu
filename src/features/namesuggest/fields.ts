import type { Field } from "../../app/feature";

export const namesuggestFields: Field[] = [
  { label: "วันเกิด", type: "date", hint: "กรอก พ.ศ. หรือ ค.ศ. ก็ได้ ระบบปรับให้อัตโนมัติ" },
  { label: "เพศ", type: "select", options: ["หญิง", "ชาย", "ไม่ระบุ"] },
  {
    label: "อักษรขึ้นต้น (ไม่บังคับ)",
    type: "text",
    placeholder: "เช่น ก",
    maxLength: 1,
    hint: "พยัญชนะไทยตัวเดียว เช่น ก ข ค (เว้นว่างได้)",
  },
];
