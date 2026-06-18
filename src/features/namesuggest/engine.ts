import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { taksaForDay } from "../../features/_shared/taksa";
import { dayFromDate } from "../../features/_shared/thaiAstro";
import { NAME_POOL, TONE } from "./content";
import { nameSum } from "./numerology";

function normYear(y: number): number {
  return y > 2300 ? y - 543 : y;
}

export function suggestNames(dateStr: string, gender: string, prefix: string): Section[] {
  let dayLabel = "";
  if (dateStr && dateStr.indexOf("-") >= 0) {
    const p = dateStr.split("-").map(Number);
    if (p.length === 3 && p.every((n) => !Number.isNaN(n))) {
      dayLabel = dayFromDate(normYear(p[0]), p[1], p[2]);
    }
  }

  const kalaSet = new Set<string>();
  if (dayLabel) taksaForDay(dayLabel)[7].letters.forEach((L) => kalaSet.add(L));

  const pool = NAME_POOL[gender] || NAME_POOL["ไม่ระบุ"];
  const safe = pool.filter((nm) => {
    if (prefix && nm.indexOf(prefix) !== 0) return false;
    if (!dayLabel) return true;
    for (const ch of nm) if (kalaSet.has(ch)) return false;
    return true;
  });

  const secs: Section[] = [];
  if (dayLabel) {
    const t = taksaForDay(dayLabel);
    secs.push({
      kind: "blocks",
      title: "อักษรนำมงคลสำหรับคนเกิดวัน" + dayLabel,
      glyph: "取",
      items: [
        {
          title: "ขึ้นต้นด้วยอักษรเดช/ศรี (แนะนำ)",
          tag: "มงคล",
          accent: TONE.good,
          text: "ชื่อที่ขึ้นต้นหรือมีอักษรกลุ่มนี้จะเสริมอำนาจและเสน่ห์",
          chips: t[2].letters.concat(t[3].letters),
        },
        {
          title: "เลี่ยงอักษรกาลกิณี",
          tag: "หลีกเลี่ยง",
          accent: TONE.bad,
          text: "อย่าให้มีพยัญชนะกลุ่มนี้ในชื่อ",
          chips: t[7].letters,
        },
      ],
    });
  }

  const chosen = (safe.length ? safe : pool).slice(0, 9);
  secs.push({
    kind: "cards",
    title: "ชื่อแนะนำ (ผ่านการคัดอักษรกาลกิณีแล้ว)",
    glyph: "名",
    subtitle: dayLabel
      ? "ทุกชื่อด้านล่างไม่มีอักษรกาลกิณีของคนเกิดวัน" + dayLabel
      : "กรอกวันเกิดเพื่อให้ระบบคัดอักษรกาลกิณีออกให้",
    items: chosen.map((nm) => {
      const ns = nameSum(nm);
      const base = dayLabel ? "เลี่ยงกาลกิณีแล้ว" : "ชื่อมงคล";
      return { value: nm, badge: gender || "", note: base + " · เลข " + ns.reduced };
    }),
  });
  secs.push({
    kind: "note",
    text: "ระบบคัดชื่อที่ไม่มีอักษรกาลกิณีตามวันเกิดจริง · ค่าผลรวมเลขศาสตร์ของชื่อขึ้นกับตารางของแต่ละสำนัก ควรตรวจกับซินแสอีกครั้งก่อนใช้จริง",
  });
  return secs;
}

export const namesuggestEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return suggestNames(vals[0] ?? "", vals[1] ?? "", vals[2] ?? "");
  },
};
