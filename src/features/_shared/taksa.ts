import type { Tone } from "../../shared/sections/types";

export interface WheelEntry {
  p: string;
  letters: string[];
}

export interface BhumiEntry {
  n: string;
  d: string;
  k: Tone;
}

export interface BhumiCell {
  bhumi: string;
  desc: string;
  k: Tone;
  planet: string;
  letters: string[];
}

export const WHEEL: WheelEntry[] = [
  { p: "อาทิตย์", letters: ["อ", "า", "ิ", "ี", "ึ", "ื", "ุ", "ู", "เ", "แ", "โ", "ใ", "ไ"] },
  { p: "จันทร์", letters: ["ก", "ข", "ค", "ฆ", "ง"] },
  { p: "อังคาร", letters: ["จ", "ฉ", "ช", "ซ", "ฌ", "ญ"] },
  { p: "พุธ", letters: ["ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ"] },
  { p: "เสาร์", letters: ["ด", "ต", "ถ", "ท", "ธ", "น"] },
  { p: "พฤหัสบดี", letters: ["บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม"] },
  { p: "ราหู", letters: ["ย", "ร", "ล", "ว"] },
  { p: "ศุกร์", letters: ["ศ", "ษ", "ส", "ห", "ฬ", "ฮ"] },
];

export const BHUMI: BhumiEntry[] = [
  { n: "บริวาร", d: "คนรอบข้าง ลูกน้อง ครอบครัว ผู้ที่คอยช่วยเหลือ", k: "info" },
  { n: "อายุ", d: "สุขภาพ ความเป็นอยู่ การดำเนินชีวิต", k: "info" },
  { n: "เดช", d: "อำนาจ บารมี ความน่าเชื่อถือ ตำแหน่ง", k: "good" },
  { n: "ศรี", d: "เสน่ห์ ทรัพย์สิน ความเป็นสิริมงคล โชคลาภ", k: "good" },
  { n: "มูละ", d: "หลักทรัพย์ รากฐาน เงินเก็บ มรดก", k: "good" },
  { n: "อุตสาหะ", d: "ความเพียร การงาน ความมานะพยายาม", k: "good" },
  { n: "มนตรี", d: "ผู้ใหญ่อุปถัมภ์ เจ้านาย ความเมตตาจากผู้มีอำนาจ", k: "good" },
  { n: "กาลกิณี", d: "สิ่งอัปมงคล อุปสรรค ควรเลี่ยงใช้เป็นพยัญชนะในชื่อ", k: "bad" },
];

export const DAY_TO_WHEEL: Record<string, number> = {
  "อาทิตย์": 0,
  "จันทร์": 1,
  "อังคาร": 2,
  "พุธ": 3,
  "พุธ (กลางวัน)": 3,
  "พุธ (กลางคืน)": 6,
  "ราหู": 6,
  "เสาร์": 4,
  "พฤหัสบดี": 5,
  "พฤหัส": 5,
  "ศุกร์": 7,
};

export function taksaForDay(dayLabel: string): BhumiCell[] {
  let start = DAY_TO_WHEEL[dayLabel];
  if (start === undefined) start = 0;
  const res: BhumiCell[] = [];
  for (let i = 0; i < 8; i++) {
    const w = WHEEL[(start + i) % 8];
    res.push({
      bhumi: BHUMI[i].n,
      desc: BHUMI[i].d,
      k: BHUMI[i].k,
      planet: w.p,
      letters: w.letters.slice(),
    });
  }
  return res;
}

export function letterBucketMap(dayLabel: string): Record<string, { bhumi: string; k: Tone }> {
  const t = taksaForDay(dayLabel);
  const map: Record<string, { bhumi: string; k: Tone }> = {};
  t.forEach((x) => {
    x.letters.forEach((L) => {
      map[L] = { bhumi: x.bhumi, k: x.k };
    });
  });
  return map;
}
