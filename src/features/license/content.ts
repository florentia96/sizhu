export const THAI_PLATE_CONVENTION =
  "ค่าตัวอักษร (พยัญชนะ) ใช้ตาราง ก=1 ตามสำนักเลขศาสตร์ทะเบียนที่เผยแพร่ทั่วไป (อ้างอิง insurverse.co.th) · " +
  "ผลรวมรวมของป้าย = ผลบวกค่าตัวอักษร + ผลบวกตัวเลขบนป้าย · " +
  "บางสำนักจัดกลุ่มพยัญชนะต่างกัน (เช่น ค กับ ต สลับกลุ่มกันได้) ผลจึงอาจต่างเล็กน้อย โปรดใช้เป็นแนวทางประกอบ";

// ตารางค่าพยัญชนะตรงกับ insurverse.co.th (สำนักที่จัด ต=3 · ค=4 · ซ=7 · ฟ=8 · ฏ=9 · ฑ=3)
// ซึ่งครบ 44 ตัวและสอดคล้องกันภายในตัวเอง — ใช้เป็นสำนักอ้างอิงเดียวของฟีเจอร์นี้
// หมายเหตุ: บางสำนัก (เช่น ktc.co.th) สลับกลุ่ม ค↔ต และไม่ครบทุกตัว จึงไม่ยึดเป็นฐาน
// ฃ/ฅ (เลิกใช้แล้ว) ให้ค่าตามอักษรฐานเดิม: ฃ→ข=2 · ฅ→ค=4
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
