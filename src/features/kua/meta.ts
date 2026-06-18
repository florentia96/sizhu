import type { FeatureMeta } from "../../app/feature";

export const meta: FeatureMeta = {
  id: "kua",
  name: "เลขกัว & ทิศมงคล",
  cn: "卦",
  desc: "เลขกัวฮวงจุ้ย (Eight Mansions) บอกทิศมงคล/ทิศร้ายสำหรับจัดบ้าน โต๊ะทำงาน หัวเตียง",
  long: "คำนวณเลขกัวจากปีเกิดและเพศ ตามวิชาฮวงจุ้ยสายโป๊ยแถ่ว (Eight Mansions) ให้ 4 ทิศมงคล (เซิงชี่/เทียนอี/เหยียนเหนียน/ฝูเว่ย) และ 4 ทิศที่ควรเลี่ยง พร้อมวิธีนำไปใช้จริง",
};

export { fields } from "./fields";
