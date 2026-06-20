import type { Section } from "../../shared/sections/types";
import { rasiFromDate, dayFromDate, DAY_LORD, rasiAll } from "../_shared/thaiAstro";
import {
  RULER,
  EL_COMPAT,
  EL_CLASH,
  EL_LOVE,
  EL_NOTE,
  EL_SHORT,
  EL_GUIDE,
} from "./content";
import { siderealCell } from "./sidereal";

const JADE = "#6cc18a";
const GOLD = "#d8a64a";
const RED = "#e0584b";

function elNoteTail(el: string): string {
  const parts = (EL_NOTE[el] || "").split("—");
  return (parts[1] || parts[0] || "").trim();
}

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
  const clashEl = all
    .filter((x) => x.el === EL_CLASH[r.el])
    .map((x) => "ราศี" + x.s);
  const ruler = RULER[r.s] || "";
  const lo = EL_LOVE[r.el] || EL_LOVE["ไฟ"];
  const guide = EL_GUIDE[r.el] || EL_GUIDE["ไฟ"];

  const grid: Section = {
    kind: "grid",
    title: "ข้อมูลราศี",
    glyph: "星",
    cells: [
      { name: "ราศี", value: "ราศี" + r.s, note: r.en },
      {
        name: "ธาตุประจำราศี",
        value: r.el,
        note: elNoteTail(r.el),
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
    // ส่งปีดิบ (y) — siderealCell/siderealSunSign เป็นเจ้าของการ normalize พ.ศ.→ค.ศ. เอง (กัน normYear ซ้ำสองชั้น)
    grid.cells.push(siderealCell(y, m, d));
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
      kind: "prose",
      title: "จุดเด่น จุดที่ควรระวัง และแนวทาง",
      glyph: "導",
      paras: [
        { h: "จุดเด่น", t: guide.strength },
        { h: "จุดที่ควรระวัง", t: guide.watch },
        { h: "แนวทางพัฒนาตัวเอง", t: guide.advice },
      ],
    },
    {
      kind: "blocks",
      title: "ราศีที่เข้ากันและที่ต้องปรับเข้าหากัน",
      glyph: "合",
      items: [
        {
          title: "ธาตุเดียวกัน (เข้าใจกันง่าย)",
          tag: "ธาตุ" + r.el,
          accent: JADE,
          text:
            "ราศีธาตุ" + r.el + "ด้วยกัน มีมุมมองและจังหวะชีวิตคล้ายกัน เน้น" +
            (EL_SHORT[r.el] || "") + "เหมือนกัน คบหาแล้วสบายใจ",
          chips: sameEl.length ? sameEl : ["—"],
        },
        {
          title: "ธาตุส่งเสริม (เติมเต็มกัน)",
          tag: "ธาตุ" + EL_COMPAT[r.el],
          accent: GOLD,
          text:
            "ราศีธาตุ" + EL_COMPAT[r.el] + "ช่วยเสริมและสมดุลกัน เติม" +
            (EL_SHORT[EL_COMPAT[r.el]] || "") + "ให้กัน เป็นคู่ที่เติบโตไปด้วยกันได้ดี",
          chips: compEl.length ? compEl : ["—"],
        },
        {
          title: "ธาตุที่ต้องปรับเข้าหากัน (ต่างจังหวะ)",
          tag: "ธาตุ" + EL_CLASH[r.el],
          accent: RED,
          text:
            "ราศีธาตุ" + EL_CLASH[r.el] + "มีจังหวะและความต้องการต่างกันมาก หากเข้าใจและเปิดใจรับความต่าง จะกลายเป็นแรงเติมเต็มที่ดีได้",
          chips: clashEl.length ? clashEl : ["—"],
        },
      ],
    },
    {
      kind: "note",
      text:
        "อิงราศีจักรแบบไทย (นิรายนะ/sidereal) ที่คำนวณจากตำแหน่งดาวจริง ช่วงวันจึงต่างจากราศีสากล (tropical) ที่อิงฤดูกาล โดยชื่ออังกฤษในวงเล็บคือราศีสากลที่ตรงกัน",
    },
    {
      kind: "note",
      text:
        "ช่วงวันในตารางเป็นค่าโดยประมาณ อาจคลาดเคลื่อนได้ราว ±1 วันในแต่ละปี ให้ยึดช่อง “ราศีตามดาวจริง (sidereal)” เป็นคำตอบที่แม่นยำที่สุด ส่วนดาวเจ้าเรือนและความเข้ากันของธาตุอ้างอิงหลักโหราศาสตร์สากล",
    },
  ];
}
