import type { Field } from "../../app/feature";

export const fields: Field[] = [
  {
    label: "เบอร์โทรศัพท์",
    type: "tel",
    placeholder: "เช่น 0812345678",
    inputMode: "numeric",
    maxLength: 10,
    hint: "เบอร์มือถือ 10 หลัก",
  },
];
