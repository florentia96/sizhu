// สร้าง/ตรวจ test/vectors/pillars-months.json จาก oracle อิสระ (lunar-javascript — คนละ algorithm กับ TS engine)
// รัน:  npm run gen:vectors   (ต้องมี devDep lunar-javascript)
//
// PHASE 1 — validate 12 vectors หลัก (test/vectors/pillars.json) ว่า oracle ตรง convention ของ engine:
//   late-zi (晚子時) + ไม่ปรับ true-solar (useSolar:false) → คาดว่า 9/12 ตรง
//   3 mismatch อธิบายได้ ไม่ใช่ bug: (ก) ก้านยาม子時ครึ่งหลัง สำนัก晚子ตีต่าง  (ข) ขอบ節ที่เวลา China(+8)≠Bangkok(+7)
// PHASE 2 — gen 12 เคสครอบ 12 กิ่งเดือน (กลางเดือน節 + เที่ยง เพื่อเลี่ยง 2 edge ข้างต้น) → เขียน pillars-months.json
import pkg from "lunar-javascript";
import fs from "node:fs";
const Solar = pkg.Solar ?? pkg.default?.Solar ?? pkg;

// สี่เสาจาก oracle — sect 2 = 晚子時 (late-zi) ให้ตรง ZI_SCHOOL default ของ engine
function fourPillars(y, mo, d, h, mi) {
  const ec = Solar.fromYmdHms(y, mo, d, h, mi, 0).getLunar().getEightChar();
  if (typeof ec.setSect === "function") ec.setSect(2);
  return [ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime()];
}

// ── PHASE 1: validate convention เทียบ 12 vectors หลัก (สร้างไว้แล้วจาก sxtwl) ──
const VALIDATE = [
  { in: [1996, 4, 3, 23, 58], p: ["丙子", "辛卯", "庚午", "丙子"] },
  { in: [1996, 4, 4, 18, 0], p: ["丙子", "辛卯", "辛未", "丁酉"] },
  { in: [1996, 4, 4, 19, 30], p: ["丙子", "壬辰", "辛未", "戊戌"] },
  { in: [2000, 1, 1, 12, 0], p: ["己卯", "丙子", "戊午", "戊午"] },
  { in: [1984, 2, 4, 10, 0], p: ["癸亥", "乙丑", "戊辰", "丁巳"] },
  { in: [1984, 2, 5, 3, 0], p: ["甲子", "丙寅", "己巳", "丙寅"] },
  { in: [2024, 1, 1, 0, 30], p: ["癸卯", "甲子", "甲子", "甲子"] },
  { in: [1990, 12, 22, 6, 15], p: ["庚午", "戊子", "辛酉", "辛卯"] },
  { in: [2008, 8, 8, 8, 8], p: ["戊子", "庚申", "庚辰", "庚辰"] },
  { in: [1975, 7, 15, 14, 45], p: ["乙卯", "癸未", "壬戌", "丁未"] },
  { in: [2001, 9, 11, 9, 3], p: ["辛巳", "丁酉", "丁丑", "乙巳"] },
  { in: [1960, 2, 29, 23, 10], p: ["庚子", "戊寅", "丁亥", "庚子"] },
];
let ok = 0;
for (const v of VALIDATE) {
  const got = fourPillars(...v.in);
  const match = JSON.stringify(got) === JSON.stringify(v.p);
  if (match) ok++;
  console.log(`${match ? "OK" : "XX"}  ${v.in.join("-")}  [${got.join(" ")}]${match ? "" : `  exp [${v.p.join(" ")}]`}`);
}
console.log(`\nPHASE 1: ${ok}/${VALIDATE.length} ตรง pillars.json (mismatch = เคส edge ที่สองสำนักตีต่าง ไม่ใช่ bug)\n`);

// ── PHASE 2: generate 12 เคสครอบ 12 กิ่งเดือน — กลางเดือน節 + เที่ยง (เลี่ยง子時 edge + ขอบ節 tz) ──
const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const GEN_IN = [
  [2001, 2, 19, 12, 0, "M"], [2001, 3, 21, 12, 0, "M"], [2001, 4, 20, 12, 0, "M"],
  [2001, 5, 21, 12, 0, "M"], [2001, 6, 21, 12, 0, "M"], [2001, 7, 22, 12, 0, "M"],
  [2001, 8, 23, 12, 0, "M"], [2001, 9, 23, 12, 0, "M"], [2001, 10, 23, 12, 0, "M"],
  [2001, 11, 22, 12, 0, "M"], [2001, 12, 22, 12, 0, "M"], [2002, 1, 20, 12, 0, "M"],
];
const gen = GEN_IN.map((i) => ({ in: i, p: fourPillars(i[0], i[1], i[2], i[3], i[4]) }));
const distinct = [...new Set(gen.map((g) => g.p[1][1]))].sort();
const missing = ZHI.filter((z) => !distinct.includes(z));
console.log("PHASE 2: กิ่งเดือนครอบ", distinct.join(""), `(${distinct.length}/12)`, missing.length ? `ขาด ${missing.join("")}` : "ครบ");

const out = "[\n" + gen.map((g) => "  " + JSON.stringify(g)).join(",\n") + "\n]\n";
fs.writeFileSync("test/vectors/pillars-months.json", out);
console.log(`เขียน test/vectors/pillars-months.json (${gen.length} เคส)`);
