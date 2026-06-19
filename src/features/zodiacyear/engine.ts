import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import {
  zodiacIndexFromCE, ZODIAC, STEM_EL, SANHE, LIUHE, HARM, clashOf, EL_LUCK, toCE,
} from "../_shared/sixtyCycle";
import { COLOR_HEX, JADE, GOLD, RED } from "./content";
import { solarTermJD, jdnNoon } from "../../engine/astro";

export { toCE };

export function zodiacYearForCE(ce: number): number {
  return zodiacIndexFromCE(ce);
}

export function lichunCE(y: number, m: number, d: number): number {
  const guess = jdnNoon(y, 2, 4);
  const lichunJd = solarTermJD(315, guess);
  const birthJd = jdnNoon(y, m, d);
  return birthJd < lichunJd ? y - 1 : y;
}

export function zodiacYearForDate(y: number, m: number, d: number): number {
  return zodiacIndexFromCE(lichunCE(y, m, d));
}

export function zodiacYearReport(ce: number): Section[] {
  const zi = zodiacYearForCE(ce);
  const z = ZODIAC[zi];
  const el = STEM_EL[(((ce % 10) + 10) % 10)];
  const yang = ce % 2 === 0;
  const luck = EL_LUCK[el[0]] ?? EL_LUCK["ดิน"];
  const trine = (SANHE.find((g) => g.indexOf(zi) >= 0) ?? []).filter((x) => x !== zi);
  const friend = LIUHE[zi];
  const clash = clashOf(zi);
  const harm = HARM[zi];

  const secs: Section[] = [];
  secs.push({
    kind: "prose",
    title: "ปี" + z.th + " (" + z.animal + " " + z.cn + ") · ธาตุ" + el[0] + " " + el[1],
    glyph: z.cn,
    paras: [
      { h: "นิสัยตามปีนักษัตร", t: z.tr },
      {
        h: "ธาตุประจำตัว: " + el[0] + (yang ? " (หยาง)" : " (หยิน)"),
        t: "ธาตุ" + el[0] + "หล่อหลอมพื้นฐานอุปนิสัย เมื่อรวมกับปีนักษัตรจะได้ภาพรวมของดวงชะตา " +
          (yang ? "พลังหยาง — แสดงออก กระตือรือร้น ลงมือไว" : "พลังหยิน — สุขุม ลึกซึ้ง คิดก่อนทำ"),
      },
      { h: "ปีเกิดจีน ค.ศ. " + ce, t: "ตามรอบ 60 ปี (ก้านฟ้า-ก้านดิน) ปีนี้คือปี" + z.th + "ธาตุ" + el[0] },
    ],
  });
  secs.push({
    kind: "swatches",
    title: "สีมงคลตามธาตุ" + el[0],
    glyph: "彩",
    tag: "เสริมธาตุ",
    accent: JADE,
    text: "สีที่ส่งเสริมธาตุประจำตัว ใส่แล้วเสริมพลังและความมั่นใจ",
    items: luck.colors.map((n) => ({ name: n, hex: COLOR_HEX[n] ?? "#888" })),
  });
  secs.push({
    kind: "grid",
    title: "ของมงคลประจำธาตุ",
    glyph: "吉",
    cells: [
      { name: "ทิศมงคล", value: luck.dir.join(" · "), note: "เสริมพลังธาตุ" + el[0] },
      { name: "เลขนำโชค", value: luck.num.join(" · "), note: "ตามคติห้าธาตุ" },
      { name: "ธาตุที่ส่งเสริม", value: luck.boost, note: "อยู่ใกล้แล้วดี" },
      { name: "ธาตุที่บั่นทอน", value: luck.drain, note: "ควรระวัง/สมดุล" },
    ],
  });
  secs.push({
    kind: "blocks",
    title: "ความเข้ากันกับนักษัตรอื่น",
    glyph: "合",
    items: [
      { title: "คู่สามัคคี (ซานเหอ 三合)", tag: "ถูกโฉลก", accent: JADE, text: "เข้ากันดีที่สุด เสริมการงานและความมั่งคั่งซึ่งกันและกัน เหมาะเป็นหุ้นส่วน/คู่ชีวิต", chips: trine.map((i) => ZODIAC[i].th + " " + ZODIAC[i].cn) },
      { title: "คู่มิตร (ลิ่วเหอ 六合)", tag: "เกื้อหนุน", accent: GOLD, text: "คู่เลขลับที่ช่วยเหลือ ไว้ใจได้ เป็นมิตรแท้และเนื้อคู่ที่ดี", chips: [ZODIAC[friend].th + " " + ZODIAC[friend].cn] },
      { title: "คู่ชง (ชง 沖)", tag: "ระวัง", accent: RED, text: "พลังปะทะกัน ความเห็นต่าง ควรใช้ความเข้าใจและถ้อยทีถ้อยอาศัย", chips: [ZODIAC[clash].th + " " + ZODIAC[clash].cn] },
      { title: "คู่เบียน (ไฮ่ 害)", tag: "ระวัง", accent: GOLD, text: "กระทบกระทั่งจุกจิก ควรสื่อสารตรงไปตรงมา", chips: [ZODIAC[harm].th + " " + ZODIAC[harm].cn] },
    ],
  });
  secs.push({ kind: "note", text: "คำนวณจากรอบ 60 ปีจีน (ราศีเกิด + ก้านธาตุ) และคติห้าธาตุ (เบญจธาตุ) · ผู้ที่เกิดเดือน ม.ค.–ต้น ก.พ. อาจคาบเกี่ยวปีนักษัตรเดิมเพราะตรุษจีนยังไม่ผ่าน" });
  return secs;
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const ce = toCE(vals[0] ?? "");
    if (ce == null) return [{ kind: "note", text: "กรุณากรอกปีเกิด (พ.ศ.) เช่น 2535" }];
    if (ce < 1900 || ce > 2100)
      return [{ kind: "note", text: "กรุณากรอกปีเกิดให้ถูกต้อง (ค.ศ. 1900–2100 หรือ พ.ศ. 2443–2643)" }];
    const dateStr = (vals[1] ?? "").trim();
    let effectiveCE = ce;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (m) {
      effectiveCE = lichunCE(parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10));
    }
    return zodiacYearReport(effectiveCE);
  },
};
