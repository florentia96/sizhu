import type { Field } from "../../app/feature";

export const kalakiniFields: Field[] = [
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
