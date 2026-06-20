import type { Section } from "../../shared/sections/types";
import { THAI_LETTER_VALUE, TONE, REDUCED_MEANING } from "./content";

function digitRoot(n: number): number {
  let x = n;
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

export function nameNumerologySum(raw: string): {
  sum: number;
  reduced: number;
  perChar: { ch: string; v: number }[];
} {
  const perChar: { ch: string; v: number }[] = [];
  let sum = 0;
  for (const ch of raw) {
    const v = THAI_LETTER_VALUE[ch];
    if (v === undefined) continue;
    perChar.push({ ch, v });
    sum += v;
  }
  return { sum, reduced: digitRoot(sum), perChar };
}

function meaningLine(label: string, reduced: number): { h: string; t: string } {
  const dm = REDUCED_MEANING[reduced];
  return dm
    ? { h: label + " เลข " + reduced + " — " + dm.t, t: dm.m }
    : { h: label + " เลข " + reduced, t: "ไม่มีคำอธิบายเฉพาะสำหรับเลขนี้" };
}

export function numerologySections(first: string, last: string): Section[] {
  const nameR = nameNumerologySum(first);
  const surR = nameNumerologySum(last || "");
  const totalR = nameNumerologySum((first || "") + (last || ""));

  // เลขชี้วัดหลัก: ใช้ค่ารวมชื่อ+สกุลถ้ามีสกุล มิฉะนั้นใช้ค่าชื่อ
  const keyR = surR.sum ? totalR.reduced : nameR.reduced;
  const keyLabel = surR.sum ? "ค่ารวมชื่อ–สกุล" : "ค่าชื่อ";
  const keyMeaning = REDUCED_MEANING[keyR];

  const secs: Section[] = [];
  secs.push({
    kind: "grid",
    title: "ผลรวมเลขศาสตร์ของชื่อ",
    glyph: "数",
    accent: TONE.warn,
    cells: [
      { name: "ค่าชื่อ", value: String(nameR.sum), note: "ลดทอน → " + nameR.reduced },
      { name: "ค่าสกุล", value: String(surR.sum), note: surR.sum ? "ลดทอน → " + surR.reduced : "ไม่ได้กรอก" },
      { name: "ค่ารวม", value: String(totalR.sum), note: "ลดทอน → " + totalR.reduced },
    ],
  });

  // ความหมายของเลขลดทอน — ส่วนที่ทำให้ผลลัพธ์ "อ่านแล้วได้ความหมาย" ไม่ใช่แค่ตัวเลข
  const paras: { h?: string; t: string }[] = [];
  if (keyMeaning) {
    paras.push({
      h: "เลขชี้วัดของชื่อนี้ = " + keyR + " (" + keyMeaning.t + ")",
      t: "อ่านจาก" + keyLabel + " (ลดทอนเหลือหลักเดียว): " + keyMeaning.m,
    });
  }
  paras.push(meaningLine("ค่าชื่อ", nameR.reduced));
  if (surR.sum) paras.push(meaningLine("ค่าสกุล", surR.reduced));
  if (paras.length) {
    secs.push({
      kind: "prose",
      title: "ความหมายเลขศาสตร์ของชื่อ",
      glyph: "意",
      accent: keyMeaning && keyMeaning.k === "good" ? TONE.good : TONE.warn,
      paras,
    });
  }

  secs.push({
    kind: "note",
    text:
      "ค่าผลรวมคำนวณตามตารางเลขศาสตร์สำนัก \"โหราเลขศาสตร์\" (ค่า 1–9 ตามพลังดวงดาว) " +
      "นับทุกพยัญชนะ สระ และวรรณยุกต์ที่อยู่ในตาราง ตารางและคำทำนายของแต่ละสำนักอาจต่างกัน " +
      "จึงใช้เป็นข้อมูลประกอบ ไม่นำมาตัดสินคะแนนหลักซึ่งยึดหลักทักษาเป็นหลัก",
  });
  return secs;
}
