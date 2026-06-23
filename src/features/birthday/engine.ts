import type { Section } from "../../shared/sections/types";
import {
  dayFromDate,
  rasiFromDate,
  DAY_LORD,
  swatch,
  lifePathFromDate,
  personalYear,
} from "../_shared/thaiAstro";
import { EL_NOTE, LIFEPATH, PY_THEME, DAY_DETAIL, RULER } from "./content";

const JADE = "#6cc18a";
const GOLD = "#d8a64a";
const RED = "#e0584b";
const STAR = "#7da6d8";

function normYear(y: number): number {
  return y > 2300 ? y - 543 : y;
}

export function birthdayReport(
  y: number,
  m: number,
  d: number,
  nowYear: number,
): Section[] {
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return [{ kind: "note", text: "กรอกวันเกิดให้ครบถ้วนแล้วลองใหม่อีกครั้ง" }];
  }
  const Y = normYear(y);
  const day = dayFromDate(Y, m, d);
  const info = DAY_LORD[day];
  const detail = DAY_DETAIL[day];
  const r = rasiFromDate(m, d);
  const ruler = RULER[r.s] || "";
  const lifePath = lifePathFromDate(Y, m, d);
  const py = personalYear(Y, m, d, nowYear);

  const secs: Section[] = [];

  // 1) Overview: birth day + day lord + zodiac sign
  secs.push({
    kind: "prose",
    title: "เกิดวัน" + day + " · " + d + "/" + m + "/" + Y,
    glyph: "日",
    paras: [
      { h: "ผู้ครองวัน: " + info.lord, t: "บุคลิกตามวันเกิด — " + info.tr },
      { h: "ราศี" + r.s + " (" + r.en + ") · " + EL_NOTE[r.el], t: r.tr },
    ],
  });

  // 2) Day lord - in-depth personality + strengths/cautions/career direction
  if (detail) {
    secs.push({
      kind: "prose",
      title: "บุคลิกของคนเกิดวัน" + day,
      glyph: "性",
      accent: STAR,
      paras: [
        { h: "จุดแข็ง", t: detail.strength },
        { h: "ข้อควรระวัง", t: detail.caution },
        { h: "แนวทางอาชีพที่เหมาะ", t: detail.career },
      ],
    });
  }

  // 3) Zodiac sign - personality + element + ruling planet
  secs.push({
    kind: "prose",
    title: "บุคลิกตามราศี" + r.s,
    glyph: "座",
    paras: [
      { h: EL_NOTE[r.el], t: r.tr },
      ruler
        ? {
            h: "ดาวเจ้าเรือน: " + ruler,
            t:
              "ราศี" +
              r.s +
              "มีดาว" +
              ruler +
              "เป็นผู้ปกครอง จึงได้รับอิทธิพลด้านบุคลิกและจังหวะชีวิตจากดาวดวงนี้",
          }
        : { t: "ราศี" + r.s + "อยู่ในกลุ่มธาตุ" + r.el },
    ],
  });

  // 4) Basic auspicious colors
  secs.push({
    kind: "swatches",
    title: "สีมงคลประจำวัน" + day,
    glyph: "彩",
    tag: "ใส่แล้วเสริมดวง",
    accent: JADE,
    text:
      "สีพื้นฐานที่เสริมดวงของคนเกิดวัน" +
      day +
      " ตามหลักทักษา ใช้เป็นเสื้อผ้า เครื่องประดับ หรือของใช้ประจำวัน",
    items: swatch(info.color),
  });

  // 5) Kalakini (inauspicious) colors
  secs.push({
    kind: "swatches",
    title: "สีกาลกิณี (ควรเลี่ยง)",
    glyph: "凶",
    tag: "หลีกเลี่ยง",
    accent: RED,
    text:
      "สีที่ถือว่าบั่นทอนดวงของคนเกิดวัน" +
      day +
      " ตามหลักทักษา ควรเลี่ยงในวันสำคัญหรือวันที่ต้องการความมั่นใจ",
    items: swatch(info.avoid),
  });

  // 6) Supplementary colors by area (based on letters / taksa colors: work-money-love-charisma)
  secs.push({
    kind: "grid",
    title: "สีเสริมแยกตามด้าน",
    glyph: "色",
    cells: [
      { name: "การงาน", value: info.work.join(" · "), note: "หน้าที่ ตำแหน่ง" },
      { name: "การเงิน", value: info.money.join(" · "), note: "โชคลาภ รายได้" },
      { name: "ความรัก", value: info.love.join(" · "), note: "เสน่ห์ คู่ครอง" },
      { name: "เมตตามหานิยม", value: info.luck.join(" · "), note: "คนรักใคร่ อุปถัมภ์" },
    ],
  });

  // 7) Personal chart summary
  secs.push({
    kind: "grid",
    title: "สรุปดวงประจำตัว",
    glyph: "吉",
    accent: GOLD,
    cells: [
      { name: "ผู้ครองวัน", value: info.lord, note: "เทพประจำวันเกิด" },
      { name: "ราศี", value: "ราศี" + r.s, note: "ธาตุ" + r.el },
      { name: "สีมงคลประจำวัน", value: info.color.join(" · "), note: "เสริมดวงพื้นฐาน" },
      { name: "สีกาลกิณี", value: info.avoid.join(" · "), note: "ควรเลี่ยง" },
      {
        name: "เลขชีวิต",
        value: "" + lifePath,
        note: LIFEPATH[lifePath] ? LIFEPATH[lifePath].k : "",
      },
      { name: "ปีส่วนตัว " + nowYear, value: "เลข " + py, note: "รอบ 9 ปีของคุณ" },
    ],
  });

  // 8) Life number - meaning + guidance
  if (LIFEPATH[lifePath]) {
    secs.push({
      kind: "prose",
      title: "เลขชีวิต " + lifePath + " — " + LIFEPATH[lifePath].k,
      glyph: "命",
      accent: STAR,
      paras: [
        { h: "ความหมาย", t: LIFEPATH[lifePath].d },
        { h: "แนวทางใช้ชีวิต", t: LIFEPATH[lifePath].guide },
        {
          t: "เลขชีวิตคำนวณจากผลรวมเลขทุกหลักของวันเดือนปีเกิด (ค.ศ.) บอกแก่นนิสัยและเส้นทางหลักของชีวิต",
        },
      ],
    });
  }

  // 9) Current-year forecast - personal year
  if (PY_THEME[py]) {
    secs.push({
      kind: "prose",
      title: "ดวงช่วงปี " + nowYear + " (ปีส่วนตัวเลข " + py + ")",
      glyph: "運",
      accent: STAR,
      paras: [
        { t: PY_THEME[py] },
        {
          t: "ปีส่วนตัวคำนวณจากเดือนและวันเกิดของคุณบวกกับปีปัจจุบัน บอกธีมหลักของปีนี้ว่าควรโฟกัสเรื่องใด และจะเปลี่ยนไปทุกปีตามรอบ 9 ปี",
        },
      ],
    });
  }

  // 10) Sources / notes
  secs.push({
    kind: "note",
    text: "บุคลิกตามวันเกิดและผู้ครองวันเป็นหลักโหราศาสตร์ไทย สีมงคลและสีกาลกิณีอิงตำราทักษา (ตำราต่างสำนักอาจกำหนดต่างกันได้เล็กน้อย) · ราศีอิงจักรราศีแบบไทย (อิงดาวจริง) ช่วงวันจึงต่างจากราศีสากล · เลขชีวิตและปีส่วนตัวคำนวณแบบเลขศาสตร์สากลจากวันเดือนปีเกิด",
  });

  return secs;
}
