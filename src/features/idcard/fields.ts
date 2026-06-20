import type { Field } from "../../app/feature";

export const idcardFields: Field[] = [
  { label: "ประเภทเลข", type: "select", options: ["บัตรประชาชน", "เลขที่บ้าน", "เลขบัญชีธนาคาร"] },
  {
    label: "เลข",
    type: "text",
    placeholder: "1234567890123",
    inputMode: "numeric",
    maxLength: 15,
    hint: "กรุณาใส่เฉพาะตัวเลข — บัตรประชาชนต้องมี 13 หลัก ส่วนเลขที่บ้านและเลขบัญชีใส่ได้ตามจริง (สูงสุด 15 หลัก)",
  },
];
