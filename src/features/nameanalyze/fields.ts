import type { Field } from "../../app/feature";

export const nameanalyzeFields: Field[] = [
  { label: "ชื่อจริง", type: "text", placeholder: "เช่น ธนกฤต" },
  { label: "นามสกุล", type: "text", placeholder: "เช่น ใจดี (ไม่บังคับ)" },
  {
    label: "วันเกิด",
    type: "select",
    options: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ (กลางวัน)",
      "พุธ (กลางคืน)",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
  },
];
