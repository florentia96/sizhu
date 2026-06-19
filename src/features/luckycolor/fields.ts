import type { Field } from "../../app/feature";

export const luckycolorFields: Field[] = [
  {
    label: "วันเกิด",
    type: "select",
    options: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
  },
  {
    label: "ด้านที่อยากเสริม",
    type: "select",
    options: ["การงาน", "การเงิน", "ความรัก", "สุขภาพ", "เมตตามหานิยม"],
  },
];
