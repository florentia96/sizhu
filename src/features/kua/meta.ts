import type { FeatureMeta } from "../../app/feature";

export const meta: FeatureMeta = {
  id: "kua",
  name: "เลขกัว & ทิศมงคล",
  cn: "卦",
  desc: "เลขกัวฮวงจุ้ย (Eight Mansions) บอกทิศมงคล/ทิศร้ายสำหรับจัดบ้าน โต๊ะทำงาน หัวเตียง",
  long: "คำนวณเลขกัวจากปีเกิดและเพศ ตามวิชาฮวงจุ้ยแปดทิศ (Eight Mansions) ให้ 4 ทิศมงคล ได้แก่ เซิงชี่ เทียนอี เหยียนเหนียน และฝูเว่ย พร้อม 4 ทิศที่ควรเลี่ยง และวิธีนำไปใช้จัดบ้านจริง",
};

export { fields } from "./fields";
