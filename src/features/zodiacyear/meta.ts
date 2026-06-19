import type { FeatureMeta } from "../../app/feature";

export const meta: FeatureMeta = {
  id: "zodiacyear",
  name: "ปีนักษัตร & ธาตุ",
  cn: "生肖",
  desc: "ปีนักษัตรจีน ธาตุประจำตัว สีมงคล และความเข้ากันกับนักษัตรอื่น",
  long: "คำนวณปีนักษัตร (12 ราศีจีน) และธาตุประจำตัวจากรอบ 60 ปี (ก้านฟ้า-ก้านดิน) พร้อมสีมงคล ทิศมงคล เลขนำโชค และคู่สามัคคี/มิตร/ชง/เบียน ตามคติเบญจธาตุ",
};

export { fields } from "./fields";
