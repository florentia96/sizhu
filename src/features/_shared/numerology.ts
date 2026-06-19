// Ported from .archive/.../moodee-lib.js (PAIRS / SUM_GOOD / SUM_BAD canonical popular table)

import type { Section } from "../../shared/sections/types";
import { TONE_HEX } from "../../shared/sections/types";

const GOLD = TONE_HEX.warn;
const RED = TONE_HEX.bad;
const JADE = TONE_HEX.good;

const toneColor: Record<"good" | "warn" | "bad", string> = {
  good: JADE,
  warn: GOLD,
  bad: RED,
};

export function digitsOnly(s: string): string {
  return (s || "").replace(/[^0-9]/g, "");
}
export function sumArr(a: number[]): number {
  return a.reduce((x, y) => x + y, 0);
}

type PairTone = "good" | "warn" | "bad";
interface PairDef {
  t: string;
  m: string;
  k: PairTone;
}

// คู่เลข 2 หลัก: t=หัวข้อ, m=ความหมาย, k=โทน — ตารางเลขศาสตร์เบอร์มงคลที่นิยม (canonical, verbatim)
const PAIRS: Record<string, PairDef> = {
  "14": { t: "เมตตามหานิยม", m: "ค้าขายดี เจรจาคล่อง เป็นที่รักของผู้คน", k: "good" },
  "41": { t: "เมตตามหานิยม", m: "ค้าขายดี มีคนอุปถัมภ์ เหมาะงานบริการ/ขาย", k: "good" },
  "15": { t: "เสน่ห์ & โชคลาภ", m: "มีเสน่ห์ โดดเด่น โชคด้านความรักและการงาน", k: "good" },
  "51": { t: "เสน่ห์ & โชคลาภ", m: "มีคนเอ็นดู สนับสนุน ได้รับโอกาสดี ๆ", k: "good" },
  "19": { t: "ความสำเร็จ & บารมี", m: "มุ่งมั่น ประสบความสำเร็จ มีผู้ใหญ่หนุน", k: "good" },
  "91": { t: "ความสำเร็จ & บารมี", m: "อำนาจ บารมี ก้าวหน้าในหน้าที่การงาน", k: "good" },
  "23": { t: "อุปถัมภ์ & เดินทาง", m: "ผู้ใหญ่ช่วยเหลือ การงานก้าวหน้า เดินทางเป็นมงคล", k: "good" },
  "32": { t: "อุปถัมภ์ & ก้าวหน้า", m: "มีคนหนุนนำ งานราชการ/ติดต่อราบรื่น", k: "good" },
  "24": { t: "การเงิน & โชคลาภ", m: "เลขมหาเศรษฐี เงินทองคล่อง โชคลาภดี", k: "good" },
  "42": { t: "การเงิน & มั่งคั่ง", m: "หนุนการเงินและทรัพย์สิน เก็บเงินอยู่", k: "good" },
  "35": { t: "ปัญญา & การเรียนรู้", m: "ความคิดดี เหมาะวิชาการ ครู ที่ปรึกษา", k: "good" },
  "53": { t: "ปัญญา & สื่อสาร", m: "พูดจาน่าเชื่อถือ เหมาะงานสื่อสาร/สอน", k: "good" },
  "36": { t: "ผู้ใหญ่อุปถัมภ์", m: "มีผู้ใหญ่เมตตา โชคลาภจากคนรอบข้าง", k: "good" },
  "63": { t: "ผู้ใหญ่อุปถัมภ์", m: "ได้รับการสนับสนุน การงานมั่นคงขึ้น", k: "good" },
  "44": { t: "มั่นคง (ดินซ้ำ)", m: "หนักแน่น มั่นคง เหมาะราชการ/อสังหาฯ", k: "good" },
  "45": { t: "อำนาจวาสนา", m: "บารมีสูง เลื่อนตำแหน่ง มีคนเกรงใจ", k: "good" },
  "54": { t: "อำนาจวาสนา", m: "ผู้นำ ตัดสินใจเด็ดขาด ได้รับการยอมรับ", k: "good" },
  "46": { t: "การเงินจากผู้ใหญ่", m: "โชคลาภ การเงินมั่นคงจากการสนับสนุน", k: "good" },
  "64": { t: "ทรัพย์มั่นคง", m: "สะสมทรัพย์ได้ดี การเงินไม่ขาดมือ", k: "good" },
  "56": { t: "โภคทรัพย์", m: "เงินทองไหลมา เด่นการค้าและการลงทุน", k: "good" },
  "65": { t: "โภคทรัพย์", m: "มั่งคั่ง มีกินมีใช้ เหมาะค้าขาย", k: "good" },
  "59": { t: "สมปรารถนา", m: "สมหวังในสิ่งที่ตั้งใจ มีโชคหนุน", k: "good" },
  "95": { t: "สมปรารถนา", m: "ความสำเร็จมาพร้อมเสน่ห์และบารมี", k: "good" },
  "69": { t: "การเงิน & เมตตา", m: "หนุนทรัพย์และความสัมพันธ์ (ระวังหมกมุ่น)", k: "good" },
  "96": { t: "การเงิน & เมตตา", m: "มีคนช่วยด้านเงินทอง การงานราบรื่น", k: "good" },
  "89": { t: "อำนาจ & ความสำเร็จ", m: "บารมี ชื่อเสียง ก้าวหน้าโดดเด่น", k: "good" },
  "98": { t: "บารมี & ชื่อเสียง", m: "ผู้นำ ได้รับการยกย่อง ประสบความสำเร็จ", k: "good" },
  "99": { t: "บารมีซ้ำ (ไฟซ้ำ)", m: "พลังสูง มุ่งมั่น แต่ต้องคุมอารมณ์ร้อน", k: "good" },
  "55": { t: "อำนาจซ้ำ (ดับเบิล)", m: "บารมีและความมั่นใจสูง เป็นที่ยอมรับ", k: "good" },
  "90": { t: "สมองดี (ระวังสุขภาพ)", m: "ความคิดเฉียบ แต่บางตำราเตือนเรื่องสุขภาพ/ใจ", k: "warn" },
  "09": { t: "ระวังสุขภาพ/จิตใจ", m: "คิดเยอะ เครียดง่าย ควรดูแลสุขภาพใจ", k: "warn" },
  "16": { t: "เสน่ห์แต่รักไม่นิ่ง", m: "มีเสน่ห์ แต่ความรักเปลี่ยนแปลงบ่อย", k: "warn" },
  "61": { t: "รักง่ายหน่ายเร็ว", m: "เจ้าเสน่ห์ ระวังปัญหาความสัมพันธ์", k: "warn" },
  "26": { t: "เสน่ห์แต่ดราม่า", m: "มีเสน่ห์มาก แต่เรื่องรักมักวุ่นวาย", k: "warn" },
  "62": { t: "รักวุ่นวาย", m: "เด่นเสน่ห์ ระวังรักสามเส้า/นอกใจ", k: "warn" },
  "28": { t: "เงินมาแต่เหนื่อย", m: "หาเงินได้แต่ต้องสู้ มีอุปสรรคแทรก", k: "warn" },
  "82": { t: "การเงินมีอุปสรรค", m: "รายรับดีแต่รายจ่ายตาม ควรวางแผน", k: "warn" },
  "18": { t: "ขัดแย้ง/คดีความ", m: "ระวังเรื่องโต้เถียง ข้อพิพาท", k: "warn" },
  "81": { t: "ขัดแย้ง", m: "มีเรื่องกระทบกระทั่ง ต้องใจเย็น", k: "warn" },
  "34": { t: "ขัดแย้งในใจ/บ้าน", m: "เครียดเรื่องครอบครัว ตัดสินใจลังเล", k: "warn" },
  "43": { t: "ลังเล/ครอบครัว", m: "มีภาระทางบ้าน ใจไม่สงบเป็นช่วง ๆ", k: "warn" },
  "37": { t: "อุปสรรคการงาน", m: "งานสะดุด ต้องอดทนและรอจังหวะ", k: "warn" },
  "73": { t: "งานติดขัด", m: "มีอุปสรรค ควรรอบคอบเรื่องสัญญา", k: "warn" },
  "48": { t: "หนี้สิน/อุปสรรค", m: "ระวังรายจ่ายเกินตัวและภาระหนี้", k: "warn" },
  "84": { t: "รายจ่ายมาก", m: "เงินรั่วไหล ควรคุมงบให้ดี", k: "warn" },
  "57": { t: "คิดมาก/เครียด", m: "ใช้สมองหนัก ควรพักผ่อนให้พอ", k: "warn" },
  "75": { t: "เครียด/วิตก", m: "ฟุ้งซ่านง่าย ควรหากิจกรรมผ่อนคลาย", k: "warn" },
  "58": { t: "การเงินสะดุด", m: "รายได้ไม่แน่นอน ควรมีเงินสำรอง", k: "warn" },
  "85": { t: "การเงินไม่นิ่ง", m: "เงินเข้าออกเร็ว เก็บยาก", k: "warn" },
  "00": { t: "ว่างเปล่า/สูญเสีย", m: "ความว่าง โดดเดี่ยว เริ่มต้นยาก", k: "bad" },
  "02": { t: "อุปสรรค/เจ็บป่วย", m: "ระวังสุขภาพและอุปสรรคเล็ก ๆ น้อย ๆ", k: "bad" },
  "20": { t: "อุปสรรค", m: "ติดขัด ล่าช้า ต้องอดทน", k: "bad" },
  "04": { t: "สูญเสีย/โดดเดี่ยว", m: "ระวังการพลัดพราก สูญเสีย", k: "bad" },
  "40": { t: "โดดเดี่ยว", m: "เหงา ขาดคนสนับสนุน", k: "bad" },
  "07": { t: "คดี/เจ็บป่วย", m: "ระวังอุบัติเหตุ คดีความ สุขภาพ", k: "bad" },
  "70": { t: "อุปสรรคใหญ่", m: "เคราะห์ ความขัดแย้ง ควรระวัง", k: "bad" },
  "08": { t: "ล้มเหลว/อุปสรรค", m: "แผนสะดุด ต้องเริ่มใหม่บ่อย", k: "bad" },
  "80": { t: "อุปสรรคหนัก", m: "งานหรือเงินสะดุดแรง", k: "bad" },
  "13": { t: "เริ่มแล้วสะดุด", m: "ลงมือดีแต่มักไม่จบ ล้มเหลวกลางทาง", k: "bad" },
  "31": { t: "ล้มเหลว", m: "อุปสรรคซ้ำ ต้องใช้ความเพียรมาก", k: "bad" },
  "27": { t: "เจ็บป่วย/ใจ", m: "ระวังสุขภาพกายใจ ความเครียดสะสม", k: "warn" },
  "72": { t: "วิตกกังวล", m: "คิดมาก นอนไม่หลับ ควรดูแลใจ", k: "warn" },
};

// ผลรวม (เลขรวมทั้งเบอร์) — กลุ่มมงคลที่นิยมอ้างถึง
const SUM_GOOD: Record<number, string> = {
  14: "เมตตามหานิยม ค้าขายรุ่งเรือง",
  15: "มีเสน่ห์ โชคลาภดี",
  19: "สำเร็จ มีบารมี",
  23: "อุปถัมภ์ เดินทางดี",
  24: "มหาเศรษฐี การเงินเด่น",
  36: "ผู้ใหญ่หนุน โชคลาภ",
  40: "มั่นคง ปัญญาดี",
  41: "เมตตา การค้าดี",
  42: "การเงินมั่งคั่ง",
  44: "มั่นคง ราชการ",
  45: "อำนาจวาสนา บารมี",
  46: "ทรัพย์จากผู้ใหญ่",
  50: "ฉลาด เจรจาเก่ง",
  51: "เสน่ห์ โชคดี",
  54: "อำนาจ ตำแหน่งสูง",
  55: "บารมีสูง",
  56: "โภคทรัพย์ มั่งคั่ง",
  59: "สมปรารถนา",
  63: "ผู้ใหญ่อุปถัมภ์",
  64: "ทรัพย์มั่นคง",
  65: "เงินทองไหลมา",
  79: "ปัญญา+โชค",
  82: "การเงินดี",
  89: "อำนาจ ความสำเร็จ",
  90: "สมองเฉียบ",
  93: "มีบารมี",
  95: "สมหวัง",
  96: "การเงิน+เมตตา",
  99: "บารมีสูงสุด",
};
const SUM_BAD: Record<number, string> = {
  13: "เริ่มแล้วสะดุด",
  18: "ขัดแย้ง คดี",
  20: "อุปสรรค",
  21: "ติดขัด",
  26: "รักวุ่นวาย",
  27: "เจ็บป่วย",
  28: "เหนื่อยเรื่องเงิน",
  31: "ล้มเหลว",
  34: "ครอบครัวเครียด",
  37: "งานสะดุด",
  48: "หนี้สิน",
  57: "เครียด",
  58: "การเงินสะดุด",
};
// legacy ใส่ 44:'' แล้ว delete — 44 จึงเป็นมงคลล้วน (อยู่ใน SUM_GOOD เท่านั้น)

export interface PairHit {
  n: string;
  title: string;
  meaning: string;
  fg: string;
  tone: PairTone;
}

export interface NumberAnalysis {
  digits: string;
  pairs: PairHit[];
  good: number;
  bad: number;
  warn: number;
  total: number;
  sumQual: "good" | "bad" | "neutral";
  sumMeaning: string;
  score: number;
}

export function analyzeNumber(raw: string): NumberAnalysis {
  const d = digitsOnly(raw);
  const pairs: PairHit[] = [];
  let good = 0,
    bad = 0,
    warn = 0;
  for (let i = 0; i < d.length - 1; i++) {
    const key = d[i] + d[i + 1];
    const info = PAIRS[key];
    if (info) {
      pairs.push({ n: key, title: info.t, meaning: info.m, fg: toneColor[info.k], tone: info.k });
      if (info.k === "good") good++;
      else if (info.k === "bad") bad++;
      else warn++;
    }
  }
  const total = sumArr(d.split("").map(Number));
  const sumQual: "good" | "bad" | "neutral" = SUM_GOOD[total]
    ? "good"
    : SUM_BAD[total]
      ? "bad"
      : "neutral";
  const sumMeaning =
    SUM_GOOD[total] ||
    SUM_BAD[total] ||
    "ผลรวมนี้ไม่อยู่ในกลุ่มเด่นตามตำรา ให้พิจารณาคู่เลขประกอบ";
  let score =
    62 + good * 6 - bad * 9 - warn * 3 + (sumQual === "good" ? 13 : sumQual === "bad" ? -14 : 0);
  score = Math.max(22, Math.min(98, Math.round(score)));
  return { digits: d, pairs, good, bad, warn, total, sumQual, sumMeaning, score };
}

export function gradeOf(score: number): { g: string; l: string } {
  if (score >= 86) return { g: "A+", l: "มงคลยอดเยี่ยม" };
  if (score >= 78) return { g: "A", l: "ดีมาก" };
  if (score >= 70) return { g: "B+", l: "ดี" };
  if (score >= 62) return { g: "B", l: "ค่อนข้างดี" };
  if (score >= 52) return { g: "C", l: "ปานกลาง" };
  if (score >= 42) return { g: "D", l: "ควรพิจารณา" };
  return { g: "E", l: "ควรเลี่ยง" };
}

export function numberReport(raw: string, label = "ชุดเลข", glyph = "數"): Section[] {
  if (digitsOnly(raw).length < 2) {
    return [{ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" }];
  }
  const a = analyzeNumber(raw);
  const gr = gradeOf(a.score);
  const accent = a.score >= 70 ? JADE : a.score >= 52 ? GOLD : RED;

  // จัดลำดับ: เสีย > เตือน > ดี (เห็นจุดที่ต้องระวังก่อน) แล้ว dedup ตามคู่เลข (เก็บอันแรกที่พบ)
  const order: Record<PairTone, number> = { bad: 0, warn: 1, good: 2 };
  const pairsShown = a.pairs.slice().sort((x, y) => order[x.tone] - order[y.tone]);
  const seen: Record<string, boolean> = {};
  const uniq: PairHit[] = [];
  for (const p of pairsShown) {
    if (!seen[p.n]) {
      seen[p.n] = true;
      uniq.push(p);
    }
  }

  const rec =
    a.score >= 78
      ? "ชุดเลขนี้จัดอยู่ในเกณฑ์ดี เหมาะใช้เป็นเบอร์/เลขประจำตัวได้เลย โดยเฉพาะถ้าคู่เลขเด่นตรงกับด้านที่คุณอยากเสริม (การเงิน การงาน เสน่ห์) หมั่นใช้งานให้เป็นเบอร์หลักเพื่อให้พลังเลขทำงานเต็มที่"
      : a.score >= 62
        ? "ชุดเลขนี้ใช้ได้ในระดับน่าพอใจ มีจุดเด่นพอควร หากต้องเลือกระหว่างหลายเบอร์ ลองเทียบกับชุดที่คู่เลขเสียน้อยกว่า หรือเลือกชุดที่คู่เลขท้าย (ตำแหน่งที่คนเห็นบ่อย) เป็นคู่มงคล"
        : 'ชุดเลขนี้มีคู่เลขที่ควรระวังค่อนข้างมาก หากเป็นเลขที่เลือกได้ (เบอร์โทร/ทะเบียน) แนะนำให้พิจารณาชุดอื่นที่ผลรวมและคู่เลขเป็นมงคลกว่า — ลองใช้เมนู "ค้นหา/แนะนำเลขมงคล" เพื่อหาชุดที่กรองคู่เลขเสียออกแล้ว';

  return [
    {
      kind: "verdict",
      score: a.score,
      grade: gr.g,
      gradeLabel: gr.l,
      accent,
      summary:
        label +
        " " +
        a.digits.length +
        " หลัก พบคู่เลขมงคล " +
        a.good +
        " คู่ · คู่ที่ควรระวัง " +
        (a.bad + a.warn) +
        " คู่ · ผลรวม " +
        a.total,
      meta: "คำนวณจากคู่เลขทุกคู่ที่อยู่ติดกัน + ค่าผลรวมตามตำรา",
    },
    {
      kind: "rows",
      title: "วิเคราะห์คู่เลขเด่น",
      glyph,
      items: uniq.length
        ? uniq.slice(0, 12).map((p) => ({ n: p.n, title: p.title, meaning: p.meaning, fg: p.fg }))
        : [
            {
              n: "–",
              title: "ไม่พบคู่เลขเด่น",
              meaning: "คู่เลขส่วนใหญ่อยู่ในกลุ่มกลาง ๆ",
              fg: GOLD,
            },
          ],
    },
    {
      kind: "grid",
      title: "สรุปสถิติชุดเลข",
      glyph: "計",
      cells: [
        { name: "จำนวนหลัก", value: a.digits.length + " หลัก", note: "ความยาวชุดเลข" },
        { name: "คู่เลขมงคล", value: a.good + " คู่", note: "ส่งเสริมดวง" },
        {
          name: "คู่ที่ควรระวัง",
          value: a.bad + a.warn + " คู่",
          note: "เตือน " + a.warn + " · เสีย " + a.bad,
        },
        {
          name: "ผลรวมทั้งหมด",
          value: "" + a.total,
          note: a.sumQual === "good" ? "มงคล" : a.sumQual === "bad" ? "ควรระวัง" : "ระดับกลาง",
        },
        { name: "คะแนนรวม", value: a.score + "/100", note: "เกรด " + gr.g },
        { name: "ระดับ", value: gr.l, note: "ตามเกณฑ์ของระบบ" },
      ],
    },
    {
      kind: "prose",
      title: "ผลรวมทั้งหมด = " + a.total,
      glyph: "數",
      paras: [
        {
          h:
            a.sumQual === "good"
              ? "ผลรวมมงคล"
              : a.sumQual === "bad"
                ? "ผลรวมที่ควรระวัง"
                : "ผลรวมระดับกลาง",
          t: a.sumMeaning,
        },
        {
          t: "หมายเหตุ: 'ผลรวมทั้งหมด' กับ 'คู่เลขติดกัน' เป็นคนละแกนการอ่าน เลขตัวเดียวกันจึงอาจให้ผลต่างกันได้ (เช่นเป็นผลรวมที่ดี แต่เป็นคู่ที่ควรระวัง) ไม่ใช่ความขัดแย้ง — ผลรวมบอกพลังภาพรวม ส่วนคู่ติดกันบอกรายละเอียดแต่ละด้าน ควรอ่านประกอบกัน",
        },
      ],
    },
    {
      kind: "prose",
      title: "คำแนะนำ",
      glyph: "吉",
      accent,
      paras: [
        { t: rec },
        {
          t: 'เคล็ดลับ: คู่เลขสองตัวท้ายสุดถือว่าสำคัญที่สุดเพราะเป็น "ปลายทาง" ของพลังเลข รองลงมาคือคู่ที่ซ้ำกันหลายครั้งในชุด',
        },
      ],
    },
    {
      kind: "note",
      text: "ความหมายอ้างอิงตำราเลขศาสตร์เบอร์มงคลที่นิยมใช้ — ให้คะแนนเฉพาะคู่เลขที่มีในตำรา (คู่อื่นถือเป็นกลาง ไม่บวก/ลบ) · คะแนนรวมเป็นเกณฑ์ของระบบเอง แต่ละสำนักอาจให้ความหมายต่างกัน ใช้เป็นแนวทางประกอบการตัดสินใจ",
    },
  ];
}

export interface WeightedAnalysis extends NumberAnalysis {
  weightedScore: number;
}

// Thai convention: the LAST adjacent pair is the "ปลายทาง" (endpoint) and weighs heaviest.
// Linear ramp w(i) = 1 + i/(P-1), 1.0 (first) -> 2.0 (last); P==1 -> w=2.
export function analyzeNumberWeighted(raw: string): WeightedAnalysis {
  const base = analyzeNumber(raw);
  const d = digitsOnly(raw);

  const toneUnit: Record<PairTone, number> = { good: 6, warn: -3, bad: -9 };
  const hits: { idx: number; tone: PairTone }[] = [];
  for (let i = 0; i < d.length - 1; i++) {
    const info = PAIRS[d[i] + d[i + 1]];
    if (info) hits.push({ idx: i, tone: info.k });
  }
  const P = Math.max(d.length - 1, 1);
  const w = (i: number) => (P <= 1 ? 2 : 1 + i / (P - 1));

  const sumBonus = base.sumQual === "good" ? 13 : base.sumQual === "bad" ? -14 : 0;
  let acc = 62 + sumBonus;
  for (const h of hits) acc += toneUnit[h.tone] * w(h.idx);
  const weightedScore = Math.max(22, Math.min(98, Math.round(acc)));

  return { ...base, weightedScore };
}

export function numberReportWeighted(raw: string, label = "ชุดเลข", glyph = "數"): Section[] {
  if (digitsOnly(raw).length < 2) {
    return [{ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" }];
  }
  const a = analyzeNumberWeighted(raw);
  const gr = gradeOf(a.weightedScore);
  const accent = a.weightedScore >= 70 ? JADE : a.weightedScore >= 52 ? GOLD : RED;

  const order: Record<PairTone, number> = { bad: 0, warn: 1, good: 2 };
  const pairsShown = a.pairs.slice().sort((x, y) => order[x.tone] - order[y.tone]);
  const seen: Record<string, boolean> = {};
  const uniq: PairHit[] = [];
  for (const p of pairsShown) {
    if (!seen[p.n]) {
      seen[p.n] = true;
      uniq.push(p);
    }
  }
  const lastPair = a.pairs.length ? a.pairs[a.pairs.length - 1] : null;

  return [
    {
      kind: "verdict",
      score: a.weightedScore,
      grade: gr.g,
      gradeLabel: gr.l,
      accent,
      summary:
        label +
        " " +
        a.digits.length +
        " หลัก (ถ่วงน้ำหนักตำแหน่ง) · คู่เลขมงคล " +
        a.good +
        " คู่ · คู่ที่ควรระวัง " +
        (a.bad + a.warn) +
        " คู่ · ผลรวม " +
        a.total,
      meta: 'ให้น้ำหนักคู่เลขท้ายมากที่สุดตามคติ "ปลายทางของพลังเลข"',
    },
    {
      kind: "rows",
      title: "วิเคราะห์คู่เลขเด่น (ถ่วงน้ำหนัก)",
      glyph,
      items: uniq.length
        ? uniq.slice(0, 12).map((p) => ({ n: p.n, title: p.title, meaning: p.meaning, fg: p.fg }))
        : [{ n: "–", title: "ไม่พบคู่เลขเด่น", meaning: "คู่เลขส่วนใหญ่อยู่ในกลุ่มกลาง ๆ", fg: GOLD }],
    },
    {
      kind: "prose",
      title: "คู่เลขปลายทาง",
      glyph: "吉",
      accent,
      paras: [
        {
          h: "ตำแหน่งสำคัญที่สุด",
          t: lastPair
            ? "คู่ท้ายสุดของชุดนี้คือ " +
              lastPair.n +
              " (" +
              lastPair.title +
              ') ซึ่งถูกถ่วงน้ำหนักมากที่สุด เพราะเป็น "ปลายทาง" ของพลังเลขตามตำราที่นิยม'
            : "ชุดเลขสั้นเกินกว่าจะมีคู่ปลายทางที่ชัดเจน",
        },
        {
          t: "การถ่วงน้ำหนักให้คู่ท้ายหนักกว่าคู่หน้า สะท้อนหลักที่ว่าตัวเลขท้ายเป็นตัวที่คนจดจำและใช้บ่อยที่สุด จึงมีอิทธิพลต่อพลังโดยรวมมากกว่า",
        },
      ],
    },
    {
      kind: "note",
      text: "คะแนนถ่วงน้ำหนักเป็นมุมมองเสริมจากคะแนนพื้นฐาน — ใช้เปรียบเทียบชุดเลขที่มีคู่เลขเหมือนกันแต่ลำดับต่างกัน",
    },
  ];
}
