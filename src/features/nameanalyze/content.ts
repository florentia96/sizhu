export const TONE = {
  good: "#6cc18a",
  warn: "#d8a64a",
  bad: "#e0584b",
  info: "#7da6d8",
} as const;

// ตารางค่าอักษรเลขศาสตร์ "โหราเลขศาสตร์" (สำนักนิยมในไทย) — ค่า 1–9 ตามพลังดวงดาว
// ที่มา: theluckyname.com, banpanicha.com (ตรงกันสองแหล่ง) — สำนักอื่นอาจต่างกัน
const VALUE_GROUPS: Record<number, string[]> = {
  1: ["ก", "ด", "ท", "ถ", "ภ", "ฤ", "า", "ุ", "ำ", "่"],
  2: ["ข", "ช", "บ", "ป", "ง", "เ", "แ", "ู", "้"],
  3: ["ฆ", "ฑ", "ฒ", "ต", "ฃ", "๋"],
  4: ["ค", "ธ", "ร", "ญ", "ษ", "โ", "ะ", "ิ", "ั"],
  5: ["ฉ", "ณ", "ฌ", "น", "ม", "ห", "ฮ", "ฎ", "ฬ", "ึ"],
  6: ["จ", "ล", "ว", "อ", "ใ"],
  7: ["ศ", "ส", "ซ", "ี", "ื"],
  8: ["ย", "พ", "ฟ", "ผ", "ฝ", "็"],
  9: ["ฏ", "ฐ", "ไ", "์"],
};

export const THAI_LETTER_VALUE: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const [v, chars] of Object.entries(VALUE_GROUPS)) {
    for (const ch of chars) m[ch] = Number(v);
  }
  return m;
})();
