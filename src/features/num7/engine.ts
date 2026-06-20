import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { dayFromDate, THAI_DAYS } from "../../features/_shared/thaiAstro";
import { zodiacIndexFromCE, ZODIAC } from "../../features/_shared/sixtyCycle";
import { PHOP_NAMES, PHOP_MEANING, BASE_MEANINGS, NUM_MEANING, HOW_TO_READ } from "./content";

const GOOD = "#6cc18a";
const STAR = "#7da6d8";
const WARN = "#d8a64a";
const GOLD = "#d8a64a";

/** map any positive integer into the 1..7 ring (0 → 7) — ตรงกับกฎ "ลบ 7 จนเหลือ 1–7" */
function ring7(n: number): number {
  const r = n % 7;
  return r === 0 ? 7 : r;
}

/** วางเลขใน 7 ช่อง: ตั้งเลขประจำฐานที่ช่องแรก แล้วเดิน +1 ทีละช่อง วน 7→1 */
function walk(seed: number): number[] {
  const row: number[] = [];
  let v = ring7(seed);
  for (let i = 0; i < 7; i++) {
    row.push(v);
    v = v === 7 ? 1 : v + 1;
  }
  return row;
}

/** Parse 'YYYY-MM-DD', normalize พ.ศ.→ค.ศ. (>2300 ⇒ -543). null if invalid/impossible date. */
function parseISO(iso: string): { y: number; m: number; d: number } | null {
  const mt = /^(\d{3,4})-(\d{1,2})-(\d{1,2})$/.exec(iso.trim());
  if (!mt) return null;
  let y = Number(mt[1]);
  const m = Number(mt[2]);
  const d = Number(mt[3]);
  if (y > 2300) y -= 543;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return { y, m, d };
}

/** เลขประจำปีนักษัตร 1=ชวด..12=กุน → ย่อเข้าวง 1..7 (กฎ "เกิน 7 ลบ 7") */
function yearSeedFromCE(y: number): number {
  return ring7(zodiacIndexFromCE(y) + 1);
}

/**
 * 7 ฐาน × 7 ภพ:
 *  ฐาน1-3 = วันเกิด/เดือนเกิด/ปีนักษัตร (ตั้งเลขประจำ แล้วเดิน +1)
 *  ฐาน4   = ผลรวมดิบของฐาน1-3 ในแต่ละภพ (กำลังพระเคราะห์)
 *  ฐาน5   = ฐาน4 ย่อเข้าวง 1..7
 *  ฐาน6   = ฐาน5 × 2 ย่อเข้าวง · ฐาน7 = ฐาน6 × 2 ย่อเข้าวง
 */
export function compute7(iso: string): number[][] | null {
  const p = parseISO(iso);
  if (!p) return null;
  const daySeed = THAI_DAYS.indexOf(dayFromDate(p.y, p.m, p.d)) + 1; // 1=อาทิตย์..7=เสาร์
  const monthSeed = ((p.m - 1) % 7) + 1; // เดือนสุริยคติ (ดูหมายเหตุ — ตำราเดิมใช้เดือนจันทรคติ)
  const yearSeed = yearSeedFromCE(p.y);

  const top = walk(daySeed);
  const mid = walk(monthSeed);
  const bot = walk(yearSeed);
  const base4 = top.map((_, i) => top[i] + mid[i] + bot[i]); // raw column sum (กำลังพระเคราะห์)
  const base5 = base4.map(ring7);
  const base6 = base5.map((v) => ring7(v * 2));
  const base7 = base6.map((v) => ring7(v * 2));
  return [top, mid, bot, base4, base5, base6, base7];
}

function badInput(): Section[] {
  return [{ kind: "note", text: "กรอกวันเกิดให้ถูกต้อง (เช่น 2535-04-13 หรือ 1992-04-13) แล้วลองใหม่อีกครั้ง" }];
}

/** ภพในฐานบนที่กำลังพระเคราะห์ (ฐานบวก) สูงที่สุด — ใช้ชี้จุดเด่นของดวง */
function strongestPhop(g: number[][]): { name: string; meaning: string; power: number } {
  let bestIdx = 0;
  for (let c = 1; c < 7; c++) if (g[3][c] > g[3][bestIdx]) bestIdx = c;
  const name = PHOP_NAMES[0][bestIdx];
  return { name, meaning: PHOP_MEANING[name] ?? "", power: g[3][bestIdx] };
}

function build(vals: string[]): Section[] {
  const iso = (vals[0] ?? "").trim();
  if (!iso) return badInput();
  const g = compute7(iso);
  if (!g) return badInput();
  const p = parseISO(iso)!;
  const dayName = dayFromDate(p.y, p.m, p.d);
  const zodiac = ZODIAC[zodiacIndexFromCE(p.y)];

  // เลขดาวเด่น (วันเกิด) = แก่นตัวตน
  const coreStar = g[0][0]; // ฐานบน ช่องอัตตะ = เลขประจำวันเกิด
  const coreStarName = NUM_MEANING[coreStar].split(" — ")[0];
  const coreStarTrait = NUM_MEANING[coreStar].split(" — ")[1];
  const strong = strongestPhop(g);

  // 1) สรุปภาพรวมแบบอ่านง่าย (verdict — ซ่อนวงแหวนเพราะศาสตร์นี้ไม่ให้เลขชี้วัด)
  const summary: Section = {
    kind: "verdict",
    score: 0,
    hideRing: true,
    grade: "วัน" + dayName,
    gradeLabel: "ปี" + zodiac.th,
    accent: STAR,
    summary:
      "ดวงเลข 7 ตัวของผู้ที่เกิดวัน" +
      dayName +
      " ปีนักษัตร" +
      zodiac.th +
      " มีดาวประจำตัวคือดาว" +
      coreStarName +
      " จึงมีแก่นนิสัยด้าน" +
      coreStarTrait +
      " ภพที่มีกำลังเด่นที่สุดในดวงคือภพ" +
      strong.name +
      " (" +
      strong.meaning +
      ") แสดงว่าเรื่องนี้มีอิทธิพลต่อชีวิตมากเป็นพิเศษ",
    meta: "วิชาเลข 7 ตัว (มหาสัตตเลข) — ผูกฐานจากวัน เดือน และปีนักษัตรที่เกิด",
  };

  // 2) ตาราง 3 ฐาน × 7 ภพ (เลขในช่อง + ดาวประจำเลข)
  const cells = PHOP_NAMES.flatMap((row, r) =>
    row.map((name, c) => ({
      name,
      value: String(g[r][c]),
      note: NUM_MEANING[g[r][c]].split(" — ")[0],
    })),
  );

  // 3) ฐานทั้ง 7 (บล็อกชิป)
  const baseRowItems = g.map((row, i) => ({
    title: BASE_MEANINGS[i + 1].split(" — ")[0],
    tag: "ฐาน " + (i + 1),
    accent: i < 3 ? STAR : i === 3 ? WARN : GOOD,
    text: BASE_MEANINGS[i + 1].split(" — ").slice(1).join(" — ") || BASE_MEANINGS[i + 1],
    chips: row.map(String),
  }));

  // 4) ความหมายราย 21 ภพ — ฐานบน/กลาง/ล่าง แยกการ์ด ครบทุกเรือน
  const proseSecs: Section[] = PHOP_NAMES.map((row, r) => ({
    kind: "prose" as const,
    title:
      r === 0
        ? "ฐานบน (วันเกิด) — 7 ภพ"
        : r === 1
          ? "ฐานกลาง (เดือนเกิด) — 7 ภพ"
          : "ฐานล่าง (ปีเกิด) — 7 ภพ",
    glyph: r === 0 ? "命" : r === 1 ? "心" : "根",
    accent: r === 0 ? STAR : r === 1 ? GOOD : GOLD,
    paras: row.map((name, c) => {
      const num = g[r][c];
      const star = NUM_MEANING[num];
      return {
        h: name + " — " + (PHOP_MEANING[name] ?? ""),
        t: "เลข " + num + " (ดาว" + star + ") มาสถิตในภพนี้",
      };
    }),
  }));

  return [
    summary,
    {
      kind: "grid",
      title: "ตารางเลข 7 ตัว · 3 ฐาน × 7 ภพ — วัน" + dayName + " ปี" + zodiac.th,
      glyph: "局",
      accent: STAR,
      cells,
    },
    {
      kind: "prose",
      title: "วิธีอ่านดวงเลข 7 ตัว",
      glyph: "讀",
      accent: GOLD,
      paras: [{ t: HOW_TO_READ }],
    },
    ...proseSecs,
    {
      kind: "blocks",
      title: "ฐานทั้ง 7 (ฐานบน/กลาง/ล่าง · ฐานบวก · ฐานเดิน)",
      glyph: "盤",
      items: baseRowItems,
    },
    {
      kind: "note",
      text:
        "ที่มาของเลขแต่ละฐาน: ฐานบนตั้งจากเลขวันเกิด (อาทิตย์=1 ถึง เสาร์=7) ฐานล่างตั้งจากเลขปีนักษัตร (ชวด=1 ถึง กุน=12 เกิน 7 ให้ลบ 7) ส่วนฐานกลางฉบับนี้ตั้งจากเดือนสุริยคติเพื่อให้คำนวณออฟไลน์ได้แน่นอน " +
        "ขณะที่ตำราดั้งเดิมใช้เดือนจันทรคติ (ต้องเทียบปฏิทินจันทรคติเพิ่ม) ผลฐานกลางจึงเป็นค่าประมาณ " +
        "นอกจากนี้ปีนักษัตรตามตำราจะเปลี่ยนที่วันขึ้น 1 ค่ำ เดือน 5 (ราวเดือนเมษายน) ฉบับนี้เปลี่ยนตามปี ค.ศ. ผู้ที่เกิดต้นปีก่อนเดือน 5 ควรตรวจสอบปีนักษัตรเพิ่มเติม " +
        "ฐานที่ 8–9 (เดินยาม) ยังไม่รวมไว้เพราะต้องใช้เวลาเกิดประกอบและยังไม่มีตัวอย่างผูกครบให้สอบทาน " +
        "ความหมายของภพและดาวอิงตำราโหราศาสตร์ไทย ต่างสำนักอาจมีรายละเอียดต่างกันได้บ้าง",
    },
  ];
}

export const engine: FeatureEngine = { build };
