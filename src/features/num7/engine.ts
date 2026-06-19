import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { dayFromDate } from "../../features/_shared/thaiAstro";
import { PHOP_NAMES, BASE_MEANINGS, NUM_MEANING } from "./content";

const GOOD = "#6cc18a";
const STAR = "#7da6d8";
const WARN = "#d8a64a";
const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

/** map any positive integer into the 1..7 ring (0 → 7) */
function ring7(n: number): number {
  const r = n % 7;
  return r === 0 ? 7 : r;
}

/** walk 7 columns: seed, +1 each step, wrap 7→1 */
function walk(seed: number): number[] {
  const row: number[] = [];
  let v = ring7(seed);
  for (let i = 0; i < 7; i++) {
    row.push(v);
    v = v === 7 ? 1 : v + 1;
  }
  return row;
}

function digitSum(n: number): number {
  return String(n)
    .split("")
    .reduce((a, c) => a + Number(c), 0);
}

/** recursive digit-sum (digit root) until a single digit 1..9 */
function digitRoot(n: number): number {
  let v = Math.abs(n);
  while (v > 9) v = digitSum(v);
  return v;
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

/** 7 rows × 7 cols: row 0..2 = ฐานบน/กลาง/ล่าง, row3 = ฐานบวก(raw), row4..6 = reduce/×2/×2 */
export function compute7(iso: string): number[][] | null {
  const p = parseISO(iso);
  if (!p) return null;
  const daySeed = THAI_DAYS.indexOf(dayFromDate(p.y, p.m, p.d)) + 1; // 1=อาทิตย์..7=เสาร์
  const monthSeed = ((p.m - 1) % 7) + 1;
  const yearSeed = ring7(digitRoot(p.y));

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
  return [{ kind: "note", text: "กรอกวันเกิดให้ถูกต้อง (YYYY-MM-DD) แล้วลองใหม่" }];
}

function build(vals: string[]): Section[] {
  const iso = (vals[0] ?? "").trim();
  if (!iso) return badInput();
  const g = compute7(iso);
  if (!g) return badInput();
  const p = parseISO(iso)!;
  const dayName = dayFromDate(p.y, p.m, p.d);

  const cells = PHOP_NAMES.flatMap((row, r) =>
    row.map((name, c) => ({
      name,
      value: String(g[r][c]),
      note: NUM_MEANING[g[r][c]].split(" — ")[0],
    })),
  );

  const baseRowItems = g.map((row, i) => ({
    title: BASE_MEANINGS[i + 1].split(" — ")[0],
    tag: "ฐาน " + (i + 1),
    accent: i < 3 ? STAR : i === 3 ? WARN : GOOD,
    text: BASE_MEANINGS[i + 1].split(" — ").slice(1).join(" — ") || BASE_MEANINGS[i + 1],
    chips: row.map(String),
  }));

  const phopParas = PHOP_NAMES[0].map((_, c) => {
    const top = PHOP_NAMES[0][c];
    return {
      h: top + " (ภพหลักที่ " + (c + 1) + ")",
      t:
        "ฐานบน " +
        g[0][c] +
        " · " +
        NUM_MEANING[g[0][c]].split(" — ")[1] +
        " | ฐานกลาง " +
        g[1][c] +
        " | ฐานล่าง " +
        g[2][c],
    };
  });

  return [
    {
      kind: "grid",
      title: "ตารางเลข 7 ตัว 3 ฐาน × 7 ภพ — วัน" + dayName,
      glyph: "局",
      accent: STAR,
      cells,
    },
    {
      kind: "blocks",
      title: "ฐานทั้ง 7 (ฐานบน/กลาง/ล่าง + ฐานบวก + ฐานเดิน)",
      glyph: "盤",
      items: baseRowItems,
    },
    {
      kind: "prose",
      title: "ความหมายราย 7 ภพหลัก (อ่านจากฐานบน)",
      glyph: "命",
      accent: STAR,
      paras: phopParas,
    },
    {
      kind: "note",
      text:
        "ผูกฐานแบบสุริยคติ (วันจากปฏิทิน · เดือน ((m-1)%7)+1 · ปีจากผลรวมเลข) เพื่อคำนวณออฟไลน์ได้แน่นอน · " +
        "ตำราเดิมใช้เดือนจันทรคติ/ปีนักษัตร (ตัดปีที่ขึ้น 1 ค่ำ เดือน 5) ซึ่งต้องใช้ปฏิทินจันทรคติเพิ่ม · " +
        "ฐาน 8–9 (เดินยาม) ไม่รวมไว้เพราะยังไม่มีตัวอย่างผูกครบให้สอบทาน · ใส่วันเกิดอย่างเดียวจึงใช้กฎ 'เกิด 00:01–05:59 นับวันก่อน' ไม่ได้",
    },
  ];
}

export const engine: FeatureEngine = { build };
