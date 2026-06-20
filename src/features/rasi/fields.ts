import type { Field } from "../../app/feature";

export const rasiFields: Field[] = [
  {
    label: "วันเกิด",
    type: "date",
    hint: "ระบุวัน เดือน ปีเกิด กรอกเป็น พ.ศ. หรือ ค.ศ. ก็ได้ ระบบปรับให้อัตโนมัติ",
  },
];
