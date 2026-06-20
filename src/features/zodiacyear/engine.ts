import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import {
  zodiacIndexFromCE, ZODIAC, STEM_EL, SANHE, LIUHE, HARM, clashOf, EL_LUCK, toCE,
  xingPartners, SELF_XING,
} from "../_shared/sixtyCycle";
import { COLOR_HEX, JADE, GOLD, RED, STAR, EL_LIFE, ANIMAL_GUIDE } from "./content";
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
  const elName = el[0];
  const yang = ce % 2 === 0;
  const luck = EL_LUCK[elName] ?? EL_LUCK["ดิน"];
  const life = EL_LIFE[elName] ?? EL_LIFE["ดิน"];
  const guide = ANIMAL_GUIDE[zi];
  const trine = (SANHE.find((g) => g.indexOf(zi) >= 0) ?? []).filter((x) => x !== zi);
  const friend = LIUHE[zi];
  const clash = clashOf(zi);
  const harm = HARM[zi];
  const xing = xingPartners(zi);
  const selfXing = SELF_XING.has(zi);
  const yinYang = yang ? "หยาง (พลังรุก)" : "หยิน (พลังสงบ)";

  const secs: Section[] = [];
  secs.push({
    kind: "prose",
    title: "ปี" + z.th + " (" + z.animal + " " + z.cn + ") ธาตุ" + elName + " " + el[1],
    glyph: z.cn,
    paras: [
      { h: "นิสัยตามปีนักษัตร", t: z.tr },
      {
        h: "ธาตุประจำตัว: " + elName + " " + yinYang,
        t: "ธาตุ" + elName + "หล่อหลอมพื้นฐานอุปนิสัย คือผู้ที่" + life.nature + " เมื่อรวมกับปีนักษัตร" + z.th +
          "จะได้ภาพรวมของดวงชะตา ผู้ที่มีพลัง" +
          (yang ? "หยางมักแสดงออกชัด กระตือรือร้น และลงมือเร็ว" : "หยินมักสุขุม ลึกซึ้ง และคิดรอบคอบก่อนลงมือ"),
      },
      { h: "ปีเกิดจีน ค.ศ. " + ce, t: "ตามรอบ 60 ปี (ก้านฟ้า-ก้านดิน 干支) ปีนี้คือปี" + z.th + "ธาตุ" + elName + " เป็นการจับคู่ของนักษัตรกับธาตุประจำปีที่เวียนครบรอบทุก 60 ปี" },
    ],
  });
  secs.push({
    kind: "prose",
    title: "ลักษณะเด่นของผู้เกิดปี" + z.th + "ธาตุ" + elName,
    glyph: "性",
    accent: STAR,
    paras: [
      { h: "จุดแข็ง", t: "โดดเด่นเรื่อง" + guide.strength + " เมื่อนิสัยตามนักษัตร" + z.th + "ทำงานร่วมกับพลังธาตุ" + elName + " จะยิ่งส่งเสริมให้ก้าวหน้าได้ดี" },
      { h: "จุดที่ควรระวัง", t: "มีแนวโน้ม" + guide.watch + " หากรู้ตัวและปรับสมดุลได้ จะลดอุปสรรคในชีวิตลงได้มาก" },
    ],
  });
  secs.push({
    kind: "grid",
    title: "ภาพรวมดวงชะตาตามธาตุ" + elName,
    glyph: "运",
    accent: STAR,
    cells: [
      { name: "การงาน", value: "工", note: life.career },
      { name: "การเงิน", value: "财", note: life.wealth },
      { name: "ความรัก", value: "情", note: life.love },
      { name: "สุขภาพ", value: "康", note: life.health },
    ],
  });
  secs.push({
    kind: "swatches",
    title: "สีมงคลตามธาตุ" + elName,
    glyph: "彩",
    tag: "เสริมธาตุ",
    accent: JADE,
    text: "สีที่ส่งเสริมธาตุประจำตัว เหมาะใช้เพื่อเสริมพลังและความมั่นใจ",
    items: luck.colors.map((n) => ({ name: n, hex: COLOR_HEX[n] ?? "#888" })),
  });
  secs.push({
    kind: "grid",
    title: "ของมงคลประจำธาตุ" + elName,
    glyph: "吉",
    cells: [
      { name: "ทิศมงคล", value: luck.dir.join(", "), note: "เสริมพลังธาตุ" + elName },
      { name: "เลขนำโชค", value: luck.num.join(", "), note: "ตามคติห้าธาตุ (เบญจธาตุ)" },
      { name: "ธาตุที่ส่งเสริม", value: luck.boost, note: "อยู่ใกล้แล้วเกื้อหนุน" },
      { name: "ธาตุที่บั่นทอน", value: luck.drain, note: "ควรระวังและหาสมดุล" },
    ],
  });
  secs.push({
    kind: "blocks",
    title: "ความเข้ากันกับนักษัตรอื่น",
    glyph: "合",
    items: [
      { title: "คู่สามัคคี (ซานเหอ 三合 — กลุ่มถูกโฉลก)", tag: "ถูกโฉลก", accent: JADE, text: "เข้ากันดีที่สุด ส่งเสริมการงานและความมั่งคั่งซึ่งกันและกัน เหมาะเป็นหุ้นส่วนและคู่ชีวิต", chips: trine.map((i) => ZODIAC[i].th + " " + ZODIAC[i].cn) },
      { title: "คู่มิตร (ลิ่วเหอ 六合 — คู่เกื้อหนุน)", tag: "เกื้อหนุน", accent: GOLD, text: "คู่ที่ช่วยเหลือและไว้ใจกันได้ เป็นมิตรแท้และเนื้อคู่ที่ดี", chips: [ZODIAC[friend].th + " " + ZODIAC[friend].cn] },
      { title: "คู่ชง (ชง 沖 — พลังปะทะ)", tag: "ระวัง", accent: RED, text: "พลังปะทะกันและมักเห็นต่าง ควรใช้ความเข้าใจและถ้อยทีถ้อยอาศัย", chips: [ZODIAC[clash].th + " " + ZODIAC[clash].cn] },
      { title: "คู่เบียน (ไฮ่ 害 — กระทบกระทั่ง)", tag: "ระวัง", accent: GOLD, text: "มีเรื่องจุกจิกกระทบกระทั่งเป็นครั้งคราว ควรสื่อสารตรงไปตรงมา", chips: [ZODIAC[harm].th + " " + ZODIAC[harm].cn] },
      {
        title: "คู่โทษ (สิง 刑 — โทษทัณฑ์)",
        tag: "ระวัง",
        accent: RED,
        text:
          "คู่ที่บั่นทอนกันแบบลึก มักกระทบจิตใจมากกว่าภายนอก ต้องอาศัยความอดทนและให้เกียรติกันเป็นพิเศษ" +
          (selfXing ? " นักษัตรนี้ยังมีโทษตัวเอง (自刑) เมื่ออยู่คู่กับนักษัตรเดียวกัน" : ""),
        chips: xing.length
          ? xing.map((i) => ZODIAC[i].th + " " + ZODIAC[i].cn)
          : selfXing
            ? [ZODIAC[zi].th + " " + ZODIAC[zi].cn + " (ตัวเอง)"]
            : ["—"],
      },
    ],
  });
  secs.push({
    kind: "prose",
    title: "คำแนะนำสำหรับผู้เกิดปี" + z.th,
    glyph: "导",
    accent: JADE,
    paras: [
      { t: guide.tip },
      { t: life.advice },
      { t: "เลือกอยู่ใกล้นักษัตรกลุ่มสามัคคีและคู่มิตรเพื่อเสริมพลัง ใช้สีและทิศมงคลประจำธาตุ" + elName + "ประกอบในชีวิตประจำวัน และรักษาสมดุลกับธาตุที่บั่นทอนเพื่อให้ดวงชะตาราบรื่นขึ้น" },
    ],
  });
  secs.push({
    kind: "note",
    text: "คำนวณจากรอบ 60 ปีจีน (นักษัตร + ก้านธาตุ) และคติห้าธาตุ (เบญจธาตุ) โดยถือ" +
      "วันลี่ชุน (立春 ราว 4 ก.พ.) เป็นวันเปลี่ยนปีนักษัตร ผู้ที่เกิดต้นปีก่อนลี่ชุนจะนับเป็นปีนักษัตรก่อนหน้า " +
      "ทั้งนี้ระบบคำนวณตามเวลามาตรฐานโดยไม่ปรับเขตเวลารายบุคคล ผู้ที่เกิดคาบเกี่ยววันลี่ชุนพอดีควรตรวจสอบเวลาเกิดเพิ่มเติม",
  });
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
