import type { Field } from "../../app/feature";

export const dreamFields: Field[] = [
  {
    label: "ข้อความฝัน",
    type: "textarea",
    placeholder: 'เล่าความฝันสั้น ๆ เช่น "ฝันเห็นงูใหญ่ในน้ำ"',
    hint: "พิมพ์สิ่งที่เด่นที่สุดในฝัน เช่น สัตว์ คน สิ่งของ หรือสถานที่ — ระบบมีสัญลักษณ์ให้เทียบกว่า 80 รายการ",
    maxLength: 200,
  },
];
