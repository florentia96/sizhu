import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { analyzeNumber, gradeOf } from "../_shared/numerology";
import { GOOD_PAIRS, LEVEL_THRESHOLD, PAGE_SIZE } from "./content";

const JADE = "#6cc18a";
const MAX_EXAMINE = 20000;
// Phone prefix: "06" — its leading pair (06/60/61) is not a "bad" pair in the
// numerology table, unlike "08" (which is bad and would reject every candidate).
const PHONE_PREFIX = "06";

function digitsOnly(s: string): string {
  return (s || "").replace(/[^0-9]/g, "");
}

export interface LuckyItem {
  raw: string;
  value: string;
  badge: string;
  note: string;
}

/** Deterministic ranked list of accepted candidates (full, unpaged).
 *  Fixed nested iteration over GOOD_PAIRS, no Math.random. */
export function rankLucky(type: string, want: string, level: string): LuckyItem[] {
  const isPlate = type === "ทะเบียนรถ";
  const threshold = LEVEL_THRESHOLD[level] ?? LEVEL_THRESHOLD["มาตรฐาน"];
  const wantDigits = digitsOnly(want);
  const seen = new Set<string>();
  const out: LuckyItem[] = [];
  let examined = 0;

  const depth = isPlate ? 2 : 4;

  const buildAndTest = (coreParts: string[]): void => {
    if (examined >= MAX_EXAMINE) return;
    examined++;
    let core = coreParts.join("");
    // เบอร์มือถือไทย = 10 หลัก: prefix "06" (2) + core 8 = 10 · ทะเบียน = 4 ตัวเลข
    core = core.slice(0, isPlate ? 4 : 8);
    const num = isPlate ? core : PHONE_PREFIX + core;
    if (wantDigits && num.indexOf(wantDigits) < 0) return;
    if (seen.has(num)) return;
    const a = analyzeNumber(num);
    if (a.bad === 0 && a.score >= threshold && a.good >= 2) {
      seen.add(num);
      const gr = gradeOf(a.score);
      const disp = isPlate ? num : num.slice(0, 3) + "-" + num.slice(3, 6) + "-" + num.slice(6);
      out.push({
        raw: digitsOnly(num),
        value: disp,
        badge: gr.g,
        note: "ผลรวม " + a.total + " · คู่ดี " + a.good,
      });
    }
  };

  const recurse = (level2: number, acc: string[]): void => {
    if (examined >= MAX_EXAMINE) return;
    if (level2 === depth) {
      buildAndTest(acc);
      return;
    }
    for (let i = 0; i < GOOD_PAIRS.length; i++) {
      if (examined >= MAX_EXAMINE) return;
      recurse(level2 + 1, acc.concat(GOOD_PAIRS[i]));
    }
  };
  recurse(0, []);

  out.sort((x, y) => {
    const sx = analyzeNumber(x.raw).score;
    const sy = analyzeNumber(y.raw).score;
    if (sy !== sx) return sy - sx;
    return x.raw < y.raw ? -1 : x.raw > y.raw ? 1 : 0;
  });
  return out;
}

export const findluckyEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const type = vals[0] || "เบอร์โทรศัพท์";
    const want = vals[1] || "";
    const level = vals[2] || "มาตรฐาน";
    const offset = Math.max(0, Number(vals[3]) || 0);

    const ranked = rankLucky(type, want, level);
    const page = ranked.slice(offset, offset + PAGE_SIZE);
    const thr = LEVEL_THRESHOLD[level] ?? LEVEL_THRESHOLD["มาตรฐาน"];

    const secs: Section[] = [];
    secs.push({
      kind: "cards",
      title: "ชุดเลขมงคลที่คัดให้ (" + type + ")",
      glyph: "尋",
      subtitle:
        "ทุกชุดผ่านการตรวจจริง: ไม่มีคู่เลขเสีย คะแนน ≥ " +
        thr +
        " · แสดง " +
        (page.length ? offset + 1 + "–" + (offset + page.length) : "0") +
        " จากทั้งหมด " +
        ranked.length +
        " ชุด",
      accent: JADE,
      items: page.map((p) => ({ value: p.value, badge: p.badge, note: p.note })),
    });
    if (!page.length) {
      secs.push({
        kind: "note",
        text:
          offset > 0
            ? "ไม่มีชุดเลขในหน้าถัดไปแล้ว · ลองลดเงื่อนไขเลขที่ต้องมี หรือเปลี่ยนระดับ"
            : "ไม่พบชุดเลขที่ตรงเงื่อนไข ลองลดเลขที่ต้องมี หรือเปลี่ยนระดับเป็นมาตรฐาน",
      });
    }
    secs.push({
      kind: "prose",
      title: "คัดเลขอย่างไร",
      glyph: "計",
      paras: [
        {
          t: "ระบบประกอบเลขจากคู่เลขมงคลตามตำราแบบเรียงลำดับคงที่ (ไม่สุ่ม) แล้ววิเคราะห์ซ้ำด้วยเครื่องเดียวกับหน้าวิเคราะห์เบอร์ เก็บเฉพาะชุดที่ไม่มีคู่เลขเสียและคะแนนถึงเกณฑ์ เรียงจากคะแนนสูงสุด · กด \"ดูเพิ่ม\" เพื่อเลื่อนหน้าถัดไป (ผลคงเดิมทุกครั้งสำหรับเงื่อนไขเดิม)",
        },
      ],
    });
    secs.push({
      kind: "note",
      text: "ความหมายอ้างอิงตำราเลขศาสตร์ที่นิยม · เพื่อความบันเทิง ควรเลือกชุดที่ผลรวมและคู่เลขเข้ากับดวงเจ้าของด้วย",
    });
    return secs;
  },
};
