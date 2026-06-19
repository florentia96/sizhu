import type { Field } from "../../app/feature";

export const idcardFields: Field[] = [
  { label: "ประเภทเลข", type: "select", options: ["บัตรประชาชน", "บ้าน", "บัญชี"] },
  { label: "เลข", type: "text", placeholder: "ใส่เฉพาะตัวเลข" },
];
