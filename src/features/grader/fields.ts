import type { Field } from "../../app/feature";

export const graderFields: Field[] = [
  {
    label: "เลขที่ต้องการตรวจ",
    type: "text",
    placeholder: "เช่น 0812345678 หรือ 1234",
    inputMode: "numeric",
    maxLength: 15,
    hint: "กรอกเฉพาะตัวเลข เช่น เบอร์โทร เลขบัญชี หรือเลขเด็ด",
  },
];
