import type { Field } from "../../app/feature";

export const findluckyFields: Field[] = [
  { label: "ประเภท", type: "select", options: ["เบอร์โทรศัพท์", "ทะเบียนรถ"] },
  {
    label: "เลขที่อยากมี",
    type: "text",
    placeholder: "เช่น 24",
    inputMode: "numeric",
    maxLength: 6,
    hint: "ใส่เลขที่อยากให้มีในชุดผลลัพธ์ เว้นว่างได้",
  },
  {
    label: "ระดับ",
    type: "select",
    options: ["มาตรฐาน", "พรีเมียม"],
    hint: "มาตรฐาน = คัดเกรด A ขึ้นไป · พรีเมียม = เฉพาะเกรด A+",
  },
];
