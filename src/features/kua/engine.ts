import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { toCE, lichunCE } from "../zodiacyear/engine";
import { KUA_DIR, GOOD_NAME, BAD_NAME, DIR_TH, JADE, GOLD } from "./content";

export function sumDigits(s: string): number {
  return (s.match(/\d/g) ?? []).reduce((a, d) => a + Number(d), 0);
}

export function reduceSingle(n: number): number {
  let x = n;
  while (x > 9) x = String(x).split("").reduce((a, d) => a + Number(d), 0);
  return x;
}

export function kuaNumber(ce: number, gender: string): number {
  // สูตร Eight Mansions (โป๊ยแถ่ว) มาตรฐาน ใช้ "2 หลักท้าย" ของปี ค.ศ. — ไม่ใช่รวมทั้ง 4 หลัก
  // ค่าคงที่ที่สลับตอนปี 2000 (10−s vs 9−s) ออกแบบมาเพื่อ 2 หลักท้ายโดยเฉพาะ
  // ที่มา: prokerala.com/feng-shui/kua-number.php (1978 ชาย=4), calculator.academy/kua-number-calculator, lovetoknow.com
  const s = reduceSingle(sumDigits(String(ce).slice(-2)));
  const male = gender === "ชาย";
  let k: number;
  if (ce >= 2000) {
    k = male ? 9 - s : s + 6;
  } else {
    k = male ? 10 - s : s + 5;
  }
  k = reduceSingle(k);
  if (k === 0) k = 9;
  if (male && k === 5) k = 2;
  if (!male && k === 5) k = 8;
  return k;
}

export function kuaReport(ce: number, gender: string): Section[] {
  const k = kuaNumber(ce, gender);
  const dirs = KUA_DIR[k];
  const group = [1, 3, 4, 9].indexOf(k) >= 0
    ? "กลุ่มทิศตะวันออก (East Group)"
    : "กลุ่มทิศตะวันตก (West Group)";
  const goodItems = GOOD_NAME.map((g, i) => ({
    title: g.th,
    tag: DIR_TH[dirs[i]],
    accent: i === 0 ? JADE : GOLD,
    text: g.d,
    chips: [DIR_TH[dirs[i]]],
  }));
  const badItems = BAD_NAME.map((g, i) => ({
    name: g.th,
    value: DIR_TH[dirs[i + 4]],
    note: g.d,
  }));

  const secs: Section[] = [];
  secs.push({
    kind: "verdict",
    score: 0,
    hideRing: true,
    grade: "กัว " + k,
    gradeLabel: group,
    accent: JADE,
    summary: "เลขกัว " + k + " — " + group + " · จัดบ้าน/โต๊ะทำงาน/หัวเตียงให้หันทิศมงคลเพื่อเสริมดวง",
    meta: "คำนวณจากปีเกิด ค.ศ. " + ce + " + เพศ ตามสูตรเลขกัวฮวงจุ้ย",
  });
  secs.push({ kind: "blocks", title: "4 ทิศมงคล (เรียงจากดีสุด)", glyph: "吉", items: goodItems });
  secs.push({ kind: "grid", title: "4 ทิศที่ควรเลี่ยง", glyph: "凶", cells: badItems });
  secs.push({
    kind: "prose",
    title: "นำไปใช้จริงอย่างไร",
    glyph: "宅",
    accent: JADE,
    paras: [
      { h: "โต๊ะทำงาน", t: "หันหน้า (ทิศที่หน้าหันไปขณะนั่ง) ไปทาง " + DIR_TH[dirs[0]] + " (เซิงชี่) เพื่อเสริมการงานและโชคลาภ" },
      { h: "หัวเตียงนอน", t: "หันหัวเตียงไปทาง " + DIR_TH[dirs[1]] + " (เทียนอี) เสริมสุขภาพ หรือ " + DIR_TH[dirs[2]] + " (เหยียนเหนียน) เสริมความรัก" },
      { h: "ประตูหลัก/ทางเข้า", t: "ให้รับพลังจากทิศมงคลข้างต้น และเลี่ยงให้ประตู/เตียงหันไปทาง " + DIR_TH[dirs[7]] + " (เจวี๋ยมิ่ง) ซึ่งเป็นทิศร้ายที่สุด" },
    ],
  });
  secs.push({ kind: "note", text: "คำนวณตามวิชาฮวงจุ้ยสายโป๊ยแถ่ว (Eight Mansions) · เปลี่ยนรอบปีราววันที่ 4 กุมภาพันธ์ของทุกปี (ไม่ใช่ 1 มกราคม) — หากไม่ได้กรอกวันเกิด และเกิดช่วงต้นปีก่อน 4 ก.พ. ให้ลองคำนวณปีก่อนหน้าเทียบด้วย" });
  return secs;
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const ce = toCE(vals[0] ?? "");
    const gender = (vals[1] ?? "").trim();
    if (ce == null || (gender !== "ชาย" && gender !== "หญิง"))
      return [{ kind: "note", text: "กรุณากรอกปีเกิด (พ.ศ.) และเลือกเพศ" }];
    if (ce < 1900 || ce > 2100)
      return [{ kind: "note", text: "กรุณากรอกปีเกิดให้ถูกต้อง (ค.ศ. 1900–2100 หรือ พ.ศ. 2443–2643)" }];
    const dateStr = (vals[2] ?? "").trim();
    let effectiveCE = ce;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (m) {
      effectiveCE = lichunCE(parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10));
    }
    return kuaReport(effectiveCE, gender);
  },
};
