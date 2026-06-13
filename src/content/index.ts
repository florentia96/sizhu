// โหลด + validate content/th.json และยืนยันว่าครบทุกคีย์ที่ engine ผลิตได้
// ถ้าถ้อยคำขาด → โยน error ตั้งแต่ build/โหลด (ไม่ปล่อยให้ undefined โผล่หน้าจอ)
import raw from "./th.json";
import { contentSchema, type Content } from "./schema";
import { GAN, ZHI, TG_TH, GROUP, SHENSHA_TH } from "../engine/constants";
import { ELEMENTS } from "../types";

const content: Content = contentSchema.parse(raw);

function assertComplete(c: Content): void {
  const miss: string[] = [];
  GAN.forEach((g) => {
    if (!c.stemNature[g]) miss.push(`stemNature.${g}`);
  });
  (Object.keys(TG_TH) as (keyof typeof TG_TH)[]).forEach((g) => {
    if (!c.tgMean[g]) miss.push(`tgMean.${g}`);
    if (!c.luckByTg[g]) miss.push(`luckByTg.${g}`);
  });
  ELEMENTS.forEach((e) => {
    if (!c.elInfo[e]) miss.push(`elInfo.${e}`);
    if (!c.organ[e]) miss.push(`organ.${e}`);
  });
  ZHI.forEach((z) => {
    if (!c.seasonName[z]) miss.push(`seasonName.${z}`);
  });
  (["ชง", "ฮะ", "เฮ่ง", "ไห่"] as const).forEach((k) => {
    if (!c.relMean[k]) miss.push(`relMean.${k}`);
  });
  (["ปี", "เดือน", "วัน", "เวลา"] as const).forEach((k) => {
    if (!c.pillarDomain[k]) miss.push(`pillarDomain.${k}`);
  });
  [...new Set(Object.values(GROUP))].forEach((g) => {
    if (!c.careerByGroup[g]) miss.push(`careerByGroup.${g}`);
  });
  Object.keys(SHENSHA_TH).forEach((s) => {
    if (!c.shenSha[s]) miss.push(`shenSha.${s}`);
  });
  if (miss.length) {
    throw new Error("content/th.json ขาดถ้อยคำ: " + miss.join(", "));
  }
}
assertComplete(content);

export { content };
export type { Content, SeasonStateId } from "./schema";
