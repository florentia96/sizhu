import type { Section } from "../../shared/sections/types";
import { rasiFromDate, dayFromDate, DAY_LORD, rasiAll } from "../_shared/thaiAstro";
import { RULER, EL_COMPAT, EL_LOVE, EL_NOTE } from "./content";
import { siderealCell } from "./sidereal";

const JADE = "#6cc18a";
const GOLD = "#d8a64a";

function normYear(y: number): number {
  return y > 2300 ? y - 543 : y;
}

export function rasiReport(y: number, m: number, d: number): Section[] {
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return [{ kind: "note", text: "กรอกวันเกิดให้ครบถ้วนแล้วลองใหม่อีกครั้ง" }];
  }
  const Y = normYear(y);
  const r = rasiFromDate(m, d);
  const day = dayFromDate(Y, m, d);
  const all = rasiAll();
  const sameEl = all
    .filter((x) => x.el === r.el && x.s !== r.s)
    .map((x) => "ราศี" + x.s);
  const compEl = all
    .filter((x) => x.el === EL_COMPAT[r.el])
    .map((x) => "ราศี" + x.s);
  const ruler = RULER[r.s] || "";
  const lo = EL_LOVE[r.el] || EL_LOVE["ไฟ"];

  const grid: Section = {
    kind: "grid",
    title: "ข้อมูลราศี",
    glyph: "星",
    cells: [
      { name: "ราศี", value: "ราศี" + r.s, note: r.en },
      {
        name: "ธาตุประจำราศี",
        value: r.el,
        note: (EL_NOTE[r.el].split("—")[1] || "").trim(),
      },
      { name: "ดาวเจ้าเรือน", value: ruler, note: "ผู้ปกครองราศี" },
      {
        name: "ช่วงวันเกิด",
        value: r.from[1] + "/" + r.from[0] + " – " + r.to[1] + "/" + r.to[0],
        note: "แบบไทย (โดยประมาณ)",
      },
    ],
  };
  try {
    grid.cells.push(siderealCell(Y, m, d));
  } catch {
    /* ephemeris unavailable -> keep tropical-only grid */
  }

  return [
    {
      kind: "prose",
      title: "ราศี" + r.s + " (" + r.en + ")",
      glyph: "座",
      paras: [
        { h: EL_NOTE[r.el], t: r.tr },
        {
          h: "ดาวเจ้าเรือน: " + ruler,
          t: "ราศี" + r.s + "มีดาว" + ruler + "เป็นผู้ปกครอง จึงได้รับอิทธิพลด้านบุคลิกและจังหวะชีวิตจากดาวดวงนี้",
        },
        { h: "เกิดวัน" + day, t: "นิสัยตามวันเกิด — " + DAY_LORD[day].tr },
      ],
    },
    grid,
    {
      kind: "prose",
      title: "ความรัก & การงานตามธาตุ" + r.el,
      glyph: "緣",
      paras: [
        { h: "ด้านความรัก", t: lo.love },
        { h: "ด้านการงาน", t: lo.work },
      ],
    },
    {
      kind: "blocks",
      title: "ราศีที่เข้ากัน",
      glyph: "合",
      items: [
        {
          title: "ธาตุเดียวกัน (เข้าใจกันง่าย)",
          tag: "ธาตุ" + r.el,
          accent: JADE,
          text: "มีมุมมองและจังหวะชีวิตคล้ายกัน คบหาแล้วสบายใจ",
          chips: sameEl.length ? sameEl : ["—"],
        },
        {
          title: "ธาตุส่งเสริม (เติมเต็มกัน)",
          tag: "ธาตุ" + EL_COMPAT[r.el],
          accent: GOLD,
          text: "ธาตุที่ช่วยเสริมและสมดุลกัน เป็นคู่ที่เติบโตไปด้วยกันได้ดี",
          chips: compEl,
        },
      ],
    },
    {
      kind: "note",
      text: "อิงราศีจักรแบบไทย (นิรายนะ/sidereal) ช่วงวันจึงต่างจากราศีสากล (tropical) ที่อิงฤดู — ชื่ออังกฤษในวงเล็บคือราศีสากลที่ตรงกัน · ช่วงวันอาจคลาด ±1 วันตามปี · ดาวเจ้าเรือนและความเข้ากันของธาตุเป็นหลักโหราศาสตร์สากล",
    },
  ];
}
