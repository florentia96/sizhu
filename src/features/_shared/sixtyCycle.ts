export interface ZodiacEntry {
  th: string;
  animal: string; // zodiac animal name in Thai (not English)
  cn: string;
  tr: string;
}

export interface ElLuckEntry {
  colors: string[];
  dir: string[];
  num: string[];
  boost: string;
  drain: string;
}

export function toCE(year: number | string): number | null {
  const y = parseInt(String(year), 10);
  if (isNaN(y)) return null;
  return y > 2300 ? y - 543 : y;
}

export const ZODIAC: ZodiacEntry[] = [
  { th: "ชวด", animal: "หนู", cn: "鼠", tr: "เฉลียวฉลาด ช่างสังเกต ประหยัด ปรับตัวเก่ง" },
  { th: "ฉลู", animal: "วัว", cn: "牛", tr: "ขยัน อดทน หนักแน่น เชื่อถือได้" },
  { th: "ขาล", animal: "เสือ", cn: "虎", tr: "กล้าหาญ มั่นใจ เป็นผู้นำ รักความยุติธรรม" },
  { th: "เถาะ", animal: "กระต่าย", cn: "兔", tr: "อ่อนโยน รอบคอบ มีไหวพริบ รักสงบ" },
  { th: "มะโรง", animal: "งูใหญ่/มังกร", cn: "龍", tr: "มีบารมี ทะเยอทะยาน มีเสน่ห์ มีพลัง" },
  { th: "มะเส็ง", animal: "งูเล็ก", cn: "蛇", tr: "ลึกซึ้ง ฉลาด มีเสน่ห์ลึกลับ สังหรณ์ดี" },
  { th: "มะเมีย", animal: "ม้า", cn: "馬", tr: "รักอิสระ ร่าเริง กระตือรือร้น ชอบเดินทาง" },
  { th: "มะแม", animal: "แพะ", cn: "羊", tr: "อ่อนโยน มีศิลปะ เมตตา รักครอบครัว" },
  { th: "วอก", animal: "ลิง", cn: "猴", tr: "เฉลียวฉลาด ไหวพริบดี สนุกสนาน ปรับตัวไว" },
  { th: "ระกา", animal: "ไก่", cn: "雞", tr: "ขยัน ตรงเวลา มั่นใจ ช่างพูด มีระเบียบ" },
  { th: "จอ", animal: "หมา", cn: "狗", tr: "ซื่อสัตย์ จงรักภักดี ยุติธรรม จริงใจ" },
  { th: "กุน", animal: "หมู", cn: "豬", tr: "ใจดี โอบอ้อมอารี จริงใจ รักความสบาย" },
];

export const STEM_EL: Record<number, [string, string]> = {
  0: ["ทอง", "金"],
  1: ["ทอง", "金"],
  2: ["น้ำ", "水"],
  3: ["น้ำ", "水"],
  4: ["ไม้", "木"],
  5: ["ไม้", "木"],
  6: ["ไฟ", "火"],
  7: ["ไฟ", "火"],
  8: ["ดิน", "土"],
  9: ["ดิน", "土"],
};

export function zodiacIndexFromCE(ce: number): number {
  return (((ce - 4) % 12) + 12) % 12;
}

export const SANHE: number[][] = [
  [0, 4, 8],
  [1, 5, 9],
  [2, 6, 10],
  [3, 7, 11],
];

export const LIUHE: Record<number, number> = {
  0: 1,
  1: 0,
  2: 11,
  11: 2,
  3: 10,
  10: 3,
  4: 9,
  9: 4,
  5: 8,
  8: 5,
  6: 7,
  7: 6,
};

export function clashOf(i: number): number {
  return (i + 6) % 12;
}

export const HARM: Record<number, number> = {
  0: 7,
  7: 0,
  1: 6,
  6: 1,
  2: 5,
  5: 2,
  3: 4,
  4: 3,
  8: 11,
  11: 8,
  9: 10,
  10: 9,
};

// xiangxing (mutual punishment) 0-based zodiac index - mirrors XING in src/engine/constants.ts (Zhi-keyed)
//   sanxing: yin-si-shen tiger-snake-monkey (2-5-8) - chou-xu-wei ox-dog-goat (1-10-7) - huxing: zi-mao rat-rabbit (0-3)
//   zixing: chen-wu-you-hai dragon-horse-rooster-pig when the animal repeats
export const XING_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [2, 5], [5, 8], [2, 8],
  [1, 10], [10, 7], [1, 7],
  [0, 3],
];
export const SELF_XING: ReadonlySet<number> = new Set([4, 6, 9, 11]);

export function isXing(a: number, b: number): boolean {
  if (a === b) return SELF_XING.has(a);
  return XING_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/** zodiac indices that form a xiangxing (mutual punishment) pair with zi (excluding itself) - used to show the compatibility list */
export function xingPartners(zi: number): number[] {
  const out: number[] = [];
  for (const [x, y] of XING_PAIRS) {
    if (x === zi && out.indexOf(y) < 0) out.push(y);
    if (y === zi && out.indexOf(x) < 0) out.push(x);
  }
  return out;
}

export const EL_LUCK: Record<string, ElLuckEntry> = {
  "ไม้": { colors: ["เขียว", "ฟ้า", "น้ำเงิน"], dir: ["ตะวันออก", "ตะวันออกเฉียงใต้"], num: ["3", "4"], boost: "น้ำ (หล่อเลี้ยง)", drain: "ทอง (ตัดไม้)" },
  "ไฟ": { colors: ["แดง", "ส้ม", "ม่วง"], dir: ["ใต้"], num: ["9"], boost: "ไม้ (เชื้อไฟ)", drain: "น้ำ (ดับไฟ)" },
  "ดิน": { colors: ["เหลือง", "น้ำตาล", "ทอง"], dir: ["ตะวันออกเฉียงเหนือ", "ตะวันตกเฉียงใต้", "กลาง"], num: ["2", "5", "8"], boost: "ไฟ (สร้างดิน)", drain: "ไม้ (ชอนไชดิน)" },
  "ทอง": { colors: ["ขาว", "ทอง", "เงิน"], dir: ["ตะวันตก", "ตะวันตกเฉียงเหนือ"], num: ["6", "7"], boost: "ดิน (ก่อเกิดโลหะ)", drain: "ไฟ (หลอมโลหะ)" },
  "น้ำ": { colors: ["ดำ", "น้ำเงินเข้ม", "เทา"], dir: ["เหนือ"], num: ["1"], boost: "ทอง (น้ำเกิดจากโลหะ)", drain: "ดิน (ดูดซับน้ำ)" },
};
