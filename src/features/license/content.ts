export const THAI_PLATE_CONVENTION =
  "ตารางค่าพยัญชนะแบบ ก=1 (สำนักเลขศาสตร์ทะเบียนที่นิยมเผยแพร่ทั่วไป) · " +
  "ผลรวมรวม = ค่าตัวอักษร + ค่าตัวเลขบนป้าย · แต่ละสำนักอาจให้ค่าต่างกัน ใช้เป็นแนวทาง";

// ฃ ฅ ซ ฏ ฑ are absent from the plan's source buckets; added here:
// ฃ/ฅ inherit their base-letter value (ฃ→ข=2, ฅ→ค=4); ซ groups with the s-sounds (=7).
// ฏ=9 (กลุ่มเดียวกับ ฐ) · ฑ=3 (กลุ่มเดียวกับ ต) ตามตารางค่าพยัญชนะทะเบียนที่เผยแพร่ทั่วไป
// (ที่มา: ktc.co.th, insurverse.co.th — ฐ=9 ตรงกับแหล่งเดิมของ plan ยืนยันว่าเป็นสำนักเดียวกัน)
const BUCKETS: Record<number, string[]> = {
  1: ["ก", "ด", "ถ", "ท", "ภ"],
  2: ["ข", "ฃ", "บ", "ป", "ง", "ช"],
  3: ["ต", "ฑ", "ฒ", "ฆ"],
  4: ["ค", "ฅ", "ธ", "ร", "ญ", "ษ"],
  5: ["ฉ", "ณ", "ฌ", "น", "ม", "ห", "ฮ", "ฎ", "ฬ"],
  6: ["จ", "ล", "ว", "อ"],
  7: ["ซ", "ศ", "ส"],
  8: ["ย", "ผ", "ฝ", "พ", "ฟ"],
  9: ["ฐ", "ฏ"],
};

export const LETTER_VALUE: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const k of Object.keys(BUCKETS)) {
    const v = Number(k);
    for (const ch of BUCKETS[v]) m[ch] = v;
  }
  return m;
})();

export function plateLetterSum(plate: string): number {
  let sum = 0;
  for (const ch of plate || "") if (LETTER_VALUE[ch] !== undefined) sum += LETTER_VALUE[ch];
  return sum;
}

export function plateDigitSum(plate: string): number {
  let sum = 0;
  for (const ch of plate || "") if (ch >= "0" && ch <= "9") sum += Number(ch);
  return sum;
}

export function plateCombinedSum(plate: string): {
  letterValueSum: number;
  digitSum: number;
  combinedSum: number;
  letters: { ch: string; value: number }[];
} {
  const letters: { ch: string; value: number }[] = [];
  for (const ch of plate || "") if (LETTER_VALUE[ch] !== undefined) letters.push({ ch, value: LETTER_VALUE[ch] });
  const letterValueSum = letters.reduce((a, b) => a + b.value, 0);
  const digitSum = plateDigitSum(plate);
  return { letterValueSum, digitSum, combinedSum: letterValueSum + digitSum, letters };
}
