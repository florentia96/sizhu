import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { ZODIAC, SANHE, LIUHE, HARM, clashOf } from "../_shared/sixtyCycle";
import { JADE, GOLD, RED, STAR } from "../zodiacyear/content";

export function zodiacCompatReport(aTh: string, bTh: string): Section[] {
  const ai = ZODIAC.findIndex((z) => z.th === aTh);
  const bi = ZODIAC.findIndex((z) => z.th === bTh);
  if (ai < 0 || bi < 0) return [{ kind: "note", text: "กรุณาเลือกนักษัตรทั้งสองฝ่าย" }];

  let score: number, label: string, accent: string;
  const points: { title: string; meaning: string; fg: string }[] = [];
  const sameTrine = SANHE.some((g) => g.indexOf(ai) >= 0 && g.indexOf(bi) >= 0);

  if (ai === bi) {
    score = 78; label = "นักษัตรเดียวกัน — เข้าใจกันดี"; accent = JADE;
    points.push({ title: "เข้าใจกันง่าย", meaning: "มีนิสัยและจังหวะชีวิตคล้ายกัน เห็นใจกันได้ดี", fg: JADE });
  } else if (LIUHE[ai] === bi) {
    score = 95; label = "คู่มิตรแท้ (ลิ่วเหอ) — ดีเยี่ยม"; accent = JADE;
    points.push({ title: "คู่เลขลับเกื้อหนุน", meaning: "ช่วยเหลือไว้ใจกันได้ เป็นคู่ที่ส่งเสริมกันทุกด้าน", fg: JADE });
  } else if (sameTrine) {
    score = 90; label = "คู่สามัคคี (ซานเหอ) — ถูกโฉลก"; accent = JADE;
    points.push({ title: "กลุ่มสามัคคี", meaning: "อยู่กลุ่มธาตุเดียวกัน เสริมการงานและความมั่งคั่งให้กัน", fg: JADE });
  } else if (clashOf(ai) === bi) {
    score = 42; label = "คู่ชง (沖) — ต้องปรับเข้าหากัน"; accent = RED;
    points.push({ title: "พลังปะทะ", meaning: "ความเห็นมักสวนทาง หากเข้าใจกันจะกลายเป็นแรงผลักดัน", fg: RED });
  } else if (HARM[ai] === bi) {
    score = 55; label = "คู่เบียน (害) — มีจุดต้องระวัง"; accent = GOLD;
    points.push({ title: "กระทบกระทั่งเล็กน้อย", meaning: "มีเรื่องให้ขุ่นใจเป็นครั้งคราว ต้องสื่อสารตรงไปตรงมา", fg: GOLD });
  } else {
    score = 70; label = "เข้ากันได้ในระดับดี"; accent = GOLD;
    points.push({ title: "ความสัมพันธ์เป็นกลาง", meaning: "ไม่ส่งเสริมหรือขัดแย้งกันชัดเจน ขึ้นกับการปรับตัวของทั้งคู่", fg: STAR });
  }
  points.push({ title: "ธาตุ", meaning: "ฝ่าย " + aTh + " กับ " + bTh + " — อ่านประกอบกับธาตุประจำปีเกิดจะละเอียดขึ้น", fg: STAR });

  const advice = score >= 85
    ? "เป็นคู่ที่ส่งเสริมกันอย่างดี ร่วมงานหรือใช้ชีวิตด้วยกันแล้วเจริญรุ่งเรือง ช่วยกันได้ทั้งการงานและการเงิน"
    : score >= 65
      ? "เข้ากันได้ดีในระดับน่าพอใจ หากเปิดใจรับความต่างของกันและกัน จะอยู่ด้วยกันได้ราบรื่นและยืนยาว"
      : "มีพลังที่ต้องปรับเข้าหากัน ความต่างอาจกลายเป็นแรงเสริมได้ถ้าสื่อสารตรงไปตรงมาและให้พื้นที่กัน";

  return [
    { kind: "compat", score, label, a: aTh + " " + ZODIAC[ai].cn, b: bTh + " " + ZODIAC[bi].cn, accent, points },
    {
      kind: "grid", title: "นิสัยของแต่ละนักษัตร", glyph: "肖", cells: [
        { name: "ฝ่าย " + aTh + " (" + ZODIAC[ai].en + ")", value: ZODIAC[ai].cn, note: ZODIAC[ai].tr },
        { name: "ฝ่าย " + bTh + " (" + ZODIAC[bi].en + ")", value: ZODIAC[bi].cn, note: ZODIAC[bi].tr },
      ],
    },
    { kind: "prose", title: "คำแนะนำสำหรับคู่นี้", glyph: "合", accent, paras: [{ t: advice }] },
    { kind: "note", text: "อ้างอิงตารางสามัคคี (ซานเหอ) · คู่มิตร (ลิ่วเหอ) · คู่ชง · คู่เบียน ตามโหราศาสตร์จีนคลาสสิก" },
  ];
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return zodiacCompatReport((vals[0] ?? "").trim(), (vals[1] ?? "").trim());
  },
};
