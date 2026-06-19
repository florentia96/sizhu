import type { Section } from "../../shared/sections/types";
import { DREAM } from "./content";

export function dreamReport(text: string): Section[] {
  const t = text || "";
  const hits = DREAM.filter((e) => e.kw.some((k) => t.indexOf(k) >= 0));
  const secs: Section[] = [];

  if (!hits.length) {
    secs.push({
      kind: "prose",
      title: "ยังจับคำสำคัญในฝันไม่ได้",
      glyph: "夢",
      paras: [
        {
          t: 'ลองพิมพ์สิ่งที่เด่นที่สุดในฝัน เช่น "งู" "น้ำ" "พระ" "ปลา" "ทอง" "รถ" ระบบจะจับคำและทำนายพร้อมเลขที่เกี่ยวข้องให้',
        },
      ],
    });
    secs.push({
      kind: "note",
      text: "การตีเลขจากฝันเป็นความเชื่อพื้นบ้าน ใช้เพื่อความบันเทิงเท่านั้น",
    });
    return secs;
  }

  const allNums: string[] = [];
  hits.forEach((h) =>
    h.n.forEach((x) => {
      if (allNums.indexOf(x) < 0) allNums.push(x);
    }),
  );

  secs.push({
    kind: "prose",
    title: "คำทำนายฝัน",
    glyph: "夢",
    paras: hits.map((h) => ({ h: "ฝันเห็น " + h.kw[0], t: h.m })),
  });

  const two = allNums.filter((x) => x.length === 2);
  const three = allNums.filter((x) => x.length === 3);
  const one = allNums.filter((x) => x.length === 1);
  const items: { value: string; badge?: string; note?: string }[] = [];
  two.forEach((x) => items.push({ value: x, badge: "2 ตัว", note: "เลขเด่น" }));
  three.forEach((x) => items.push({ value: x, badge: "3 ตัว", note: "ชุดแนะนำ" }));
  one.forEach((x) => items.push({ value: x, badge: "วิ่ง", note: "เลขเดี่ยว" }));

  secs.push({
    kind: "cards",
    title: "เลขที่เกี่ยวข้องกับฝัน",
    glyph: "數",
    subtitle: "รวบรวมจากคำทำนายฝันที่จับได้",
    items,
  });
  secs.push({
    kind: "note",
    text: "การตีเลขจากฝันเป็นความเชื่อพื้นบ้านไทย ใช้เพื่อความบันเทิง โปรดเล่นอย่างมีสติ",
  });
  return secs;
}
