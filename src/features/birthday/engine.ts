import type { Section } from "../../shared/sections/types";
import {
  dayFromDate,
  rasiFromDate,
  DAY_LORD,
  swatch,
  lifePathFromDate,
  personalYear,
} from "../_shared/thaiAstro";
import { EL_NOTE, LIFEPATH, PY_THEME } from "./content";

const JADE = "#6cc18a";
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
  const r = rasiFromDate(m, d);
  const lifePath = lifePathFromDate(Y, m, d);
  const py = personalYear(Y, m, d, nowYear);

  const secs: Section[] = [];
  secs.push({
    kind: "prose",
    title: "เกิดวัน" + day + " · " + d + "/" + m + "/" + Y,
    glyph: "日",
    paras: [
      { h: "ผู้ครองวัน: " + info.lord, t: "นิสัยตามวันเกิด — " + info.tr },
      { h: "ราศี" + r.s + " (" + r.en + ") · " + EL_NOTE[r.el], t: r.tr },
    ],
  });
  secs.push({
    kind: "swatches",
    title: "สีมงคลประจำวัน" + day,
    glyph: "彩",
    tag: "ใส่แล้วรุ่ง",
    accent: JADE,
    text: "สีพื้นฐานที่เสริมดวงของคนเกิดวัน" + day,
    items: swatch(info.color),
  });
  secs.push({
    kind: "grid",
    title: "สรุปดวงประจำตัว",
    glyph: "吉",
    cells: [
      { name: "สีมงคลประจำวัน", value: info.color.join(" · "), note: "เสริมดวงพื้นฐาน" },
      { name: "สีกาลกิณี", value: info.avoid.join(" · "), note: "ควรเลี่ยง" },
      { name: "ราศี", value: "ราศี" + r.s, note: "ธาตุ" + r.el },
      {
        name: "เลขชีวิต (Life Path)",
        value: "" + lifePath,
        note: LIFEPATH[lifePath] ? LIFEPATH[lifePath].k : "",
      },
      { name: "ปีส่วนตัว " + nowYear, value: "เลข " + py, note: "รอบ 9 ปีของคุณ" },
    ],
  });
  if (LIFEPATH[lifePath]) {
    secs.push({
      kind: "prose",
      title: "เลขชีวิต " + lifePath + " — " + LIFEPATH[lifePath].k,
      glyph: "命",
      paras: [{ t: LIFEPATH[lifePath].d }],
    });
  }
  if (PY_THEME[py]) {
    secs.push({
      kind: "prose",
      title: "ดวงช่วงปี " + nowYear + " (ปีส่วนตัวเลข " + py + ")",
      glyph: "運",
      accent: STAR,
      paras: [
        { t: PY_THEME[py] },
        {
          t: "ปีส่วนตัวคำนวณจากเดือน+วันเกิดของคุณบวกกับปีปัจจุบัน บอกธีมหลักของปีนี้ว่าควรโฟกัสเรื่องใด",
        },
      ],
    });
  }
  secs.push({
    kind: "note",
    text: "นิสัยตามวันเกิดและผู้ครองวันเป็นหลักโหราศาสตร์ไทย · ราศีอิงจักรราศีแบบไทย (นิรายนะ/sidereal) ชื่ออังกฤษในวงเล็บคือราศีสากล (tropical) ที่ตรงกัน ช่วงวันจึงต่างจากราศีฝรั่ง · เลขชีวิต/ปีส่วนตัวคำนวณแบบเลขศาสตร์สากลจากวันเดือนปีเกิด",
  });
  return secs;
}
