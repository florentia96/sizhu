export interface ZodiacEntry {
  th: string;
  en: string;
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
  { th: "ชวด", en: "หนู", cn: "鼠", tr: "เฉลียวฉลาด ช่างสังเกต ประหยัด ปรับตัวเก่ง" },
  { th: "ฉลู", en: "วัว", cn: "牛", tr: "ขยัน อดทน หนักแน่น เชื่อถือได้" },
  { th: "ขาล", en: "เสือ", cn: "虎", tr: "กล้าหาญ มั่นใจ เป็นผู้นำ รักความยุติธรรม" },
  { th: "เถาะ", en: "กระต่าย", cn: "兔", tr: "อ่อนโยน รอบคอบ มีไหวพริบ รักสงบ" },
  { th: "มะโรง", en: "งูใหญ่/มังกร", cn: "龍", tr: "มีบารมี ทะเยอทะยาน มีเสน่ห์ มีพลัง" },
  { th: "มะเส็ง", en: "งูเล็ก", cn: "蛇", tr: "ลึกซึ้ง ฉลาด มีเสน่ห์ลึกลับ สังหรณ์ดี" },
  { th: "มะเมีย", en: "ม้า", cn: "馬", tr: "รักอิสระ ร่าเริง กระตือรือร้น ชอบเดินทาง" },
  { th: "มะแม", en: "แพะ", cn: "羊", tr: "อ่อนโยน มีศิลปะ เมตตา รักครอบครัว" },
  { th: "วอก", en: "ลิง", cn: "猴", tr: "เฉลียวฉลาด ไหวพริบดี สนุกสนาน ปรับตัวไว" },
  { th: "ระกา", en: "ไก่", cn: "雞", tr: "ขยัน ตรงเวลา มั่นใจ ช่างพูด มีระเบียบ" },
  { th: "จอ", en: "หมา", cn: "狗", tr: "ซื่อสัตย์ จงรักภักดี ยุติธรรม จริงใจ" },
  { th: "กุน", en: "หมู", cn: "豬", tr: "ใจดี โอบอ้อมอารี จริงใจ รักความสบาย" },
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

export const EL_LUCK: Record<string, ElLuckEntry> = {
  "ไม้": { colors: ["เขียว", "ฟ้า", "น้ำเงิน"], dir: ["ตะวันออก", "ตะวันออกเฉียงใต้"], num: ["3", "4"], boost: "น้ำ (หล่อเลี้ยง)", drain: "ทอง (ตัดไม้)" },
  "ไฟ": { colors: ["แดง", "ส้ม", "ม่วง"], dir: ["ใต้"], num: ["9"], boost: "ไม้ (เชื้อไฟ)", drain: "น้ำ (ดับไฟ)" },
  "ดิน": { colors: ["เหลือง", "น้ำตาล", "ทอง"], dir: ["ตะวันออกเฉียงเหนือ", "ตะวันตกเฉียงใต้", "กลาง"], num: ["2", "5", "8"], boost: "ไฟ (สร้างดิน)", drain: "ไม้ (ชอนไชดิน)" },
  "ทอง": { colors: ["ขาว", "ทอง", "เงิน"], dir: ["ตะวันตก", "ตะวันตกเฉียงเหนือ"], num: ["6", "7"], boost: "ดิน (ก่อเกิดโลหะ)", drain: "ไฟ (หลอมโลหะ)" },
  "น้ำ": { colors: ["ดำ", "น้ำเงินเข้ม", "เทา"], dir: ["เหนือ"], num: ["1"], boost: "ทอง (น้ำเกิดจากโลหะ)", drain: "ดิน (ดูดซับน้ำ)" },
};
