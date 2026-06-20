import type { Field } from "../../app/feature";

export const fields: Field[] = [
  {
    label: "ปีเกิด (พ.ศ. หรือ ค.ศ.)",
    type: "text",
    placeholder: "เช่น 2535",
    inputMode: "numeric",
    maxLength: 4,
    hint: "กรอกเป็น พ.ศ. หรือ ค.ศ. ก็ได้ ระบบจะปรับให้อัตโนมัติ",
  },
  {
    label: "วันเกิด (ถ้าทราบ — ช่วยปรับช่วงตรุษจีน)",
    type: "date",
    hint: "กรอกเมื่อเกิดต้นปี (ม.ค.–ต้น ก.พ.) เพื่อปรับปีนักษัตรตามวันลี่ชุน (立春 วันเปลี่ยนปีจีน)",
  },
];
