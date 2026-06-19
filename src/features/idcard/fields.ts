import type { Field } from "../../app/feature";

export const idcardFields: Field[] = [
  { label: "ประเภทเลข", type: "select", options: ["บัตรประชาชน", "เลขที่บ้าน", "เลขบัญชีธนาคาร"] },
  {
    label: "เลข",
    type: "text",
    placeholder: "เช่น 1234567890123",
    inputMode: "numeric",
    hint: "บัตรประชาชน = 13 หลัก · เลขที่บ้าน/บัญชี ใส่เฉพาะตัวเลข",
  },
];
