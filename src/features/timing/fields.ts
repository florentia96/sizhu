import type { Field } from "../../app/feature";

export const fields: Field[] = [
  {
    label: "ประเภทงาน",
    type: "select",
    options: ["ขึ้นบ้านใหม่", "แต่งงาน", "เปิดร้าน/ธุรกิจ", "ออกรถ", "เซ็นสัญญา"],
  },
  { label: "เดือน", type: "month" },
];
