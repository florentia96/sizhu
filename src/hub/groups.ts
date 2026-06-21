import type { GroupId } from "../app/feature";

export interface GroupMeta {
  id: GroupId;
  title: string;
  sub: string;
  cn: string;
  color: string;
  glow: string;
}

// สีหมวด — โทน "ฟ้าอรุณ" มิดโทนพาสเทล อ่านได้ทั้งโหมดสว่าง/มืด
export const GROUPS: GroupMeta[] = [
  {
    id: "numbers",
    title: "ตัวเลขมงคล",
    sub: "เบอร์ · ทะเบียน · บัญชี · ค้นหาเลขดี",
    cn: "數",
    color: "#4faa86",
    glow: "rgba(79,170,134,.3)",
  },
  {
    id: "names",
    title: "ชื่อมงคล",
    sub: "วิเคราะห์ · ตั้งชื่อ · อักษรกาลกิณี",
    cn: "名",
    color: "#c79447",
    glow: "rgba(199,148,71,.3)",
  },
  {
    id: "astro",
    title: "โหราศาสตร์",
    sub: "ดวงกำเนิด · ลัคนา · เลข 7 ตัว · ดวงคู่ · ฤกษ์ยาม",
    cn: "星",
    color: "#5f82d0",
    glow: "rgba(95,130,208,.3)",
  },
  {
    id: "chinese",
    title: "ศาสตร์จีน",
    sub: "ปาจื้อ · นักษัตร · กัวเลข · ดวงคู่จีน",
    cn: "緣",
    color: "#d9745f",
    glow: "rgba(217,116,95,.3)",
  },
  {
    id: "daily",
    title: "ดวงประจำวัน & ความเชื่อไทย",
    sub: "วันเกิด · ราศี · สีมงคล · ทำนายฝัน",
    cn: "卦",
    color: "#a273c9",
    glow: "rgba(162,115,201,.3)",
  },
];

export const GROUP_BY_ID: Record<GroupId, GroupMeta> = GROUPS.reduce(
  (acc, g) => {
    acc[g.id] = g;
    return acc;
  },
  {} as Record<GroupId, GroupMeta>,
);

export function accentOf(group: GroupId): string {
  return GROUP_BY_ID[group].color;
}
