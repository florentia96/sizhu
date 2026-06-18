import type { GroupId } from "../app/feature";

export interface GroupMeta {
  id: GroupId;
  title: string;
  sub: string;
  cn: string;
  color: string;
  glow: string;
}

export const GROUPS: GroupMeta[] = [
  {
    id: "numbers",
    title: "ตัวเลขมงคล",
    sub: "เบอร์ · ทะเบียน · บัญชี · ค้นหาเลขดี",
    cn: "數",
    color: "#6cc18a",
    glow: "rgba(108,193,138,.3)",
  },
  {
    id: "names",
    title: "ชื่อมงคล",
    sub: "วิเคราะห์ · ตั้งชื่อ · อักษรกาลกิณี",
    cn: "名",
    color: "#d8a64a",
    glow: "rgba(216,166,74,.3)",
  },
  {
    id: "astro",
    title: "โหราศาสตร์",
    sub: "ดวงกำเนิด · ลัคนา · เลข 7 ตัว · ดวงคู่ · ฤกษ์ยาม",
    cn: "星",
    color: "#7da6d8",
    glow: "rgba(125,166,216,.3)",
  },
  {
    id: "chinese",
    title: "ศาสตร์จีน",
    sub: "ปาจื้อ · นักษัตร · กัวเลข · ดวงคู่จีน",
    cn: "緣",
    color: "#e0584b",
    glow: "rgba(224,88,75,.3)",
  },
  {
    id: "daily",
    title: "ดวงประจำวัน & ความเชื่อไทย",
    sub: "วันเกิด · ราศี · สีมงคล · ทำนายฝัน",
    cn: "卦",
    color: "#c98ad8",
    glow: "rgba(201,138,216,.3)",
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
