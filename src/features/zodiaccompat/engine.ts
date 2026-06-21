import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { ZODIAC, SANHE, LIUHE, HARM, clashOf, isXing } from "../_shared/sixtyCycle";
import { JADE, GOLD, RED, STAR } from "../zodiacyear/content";

// ธาตุประจำก้านดินของแต่ละนักษัตร (สะท้อน BRANCH_EL ใน src/engine/constants.ts)
const BRANCH_EL: readonly string[] = [
  "น้ำ", "ดิน", "ไม้", "ไม้", "ดิน", "ไฟ", "ไฟ", "ดิน", "ทอง", "ทอง", "ดิน", "น้ำ",
];
// วัฏจักรห้าธาตุ (สะท้อน GEN/CTRL ใน src/engine/constants.ts)
const GEN: Record<string, string> = { "ไม้": "ไฟ", "ไฟ": "ดิน", "ดิน": "ทอง", "ทอง": "น้ำ", "น้ำ": "ไม้" };
const CTRL: Record<string, string> = { "ไม้": "ดิน", "ดิน": "น้ำ", "น้ำ": "ไฟ", "ไฟ": "ทอง", "ทอง": "ไม้" };

function elementPoint(ai: number, bi: number): { title: string; meaning: string; fg: string } {
  const ea = BRANCH_EL[ai];
  const eb = BRANCH_EL[bi];
  if (ea === eb)
    return {
      title: "ธาตุเดียวกัน (" + ea + ")",
      meaning: "ทั้งคู่อยู่ธาตุ" + ea + "เหมือนกัน เข้าใจจังหวะกันเร็ว แต่ควรหาธาตุอื่นมาเสริมให้สมดุล ไม่ให้พลังกระจุกด้านเดียว",
      fg: JADE,
    };
  if (GEN[ea] === eb)
    return {
      title: "ธาตุหล่อเลี้ยงกัน (" + ea + " ก่อ " + eb + ")",
      meaning: "ธาตุของคุณหล่อเลี้ยงคู่ เป็นพลังเกื้อกูลกัน ผลักดันให้กันเติบโต",
      fg: JADE,
    };
  if (GEN[eb] === ea)
    return {
      title: "ธาตุหล่อเลี้ยงกัน (" + eb + " ก่อ " + ea + ")",
      meaning: "ธาตุของคู่หล่อเลี้ยงคุณ เป็นพลังเกื้อกูลกัน ผลักดันให้กันเติบโต",
      fg: JADE,
    };
  if (CTRL[ea] === eb)
    return {
      title: "ธาตุข่มกัน (" + ea + " ข่ม " + eb + ")",
      meaning: "ธาตุของคุณข่มคู่ อาจมีจังหวะกดดันกัน ควรแบ่งบทบาทให้ชัดและเคารพพื้นที่ของกัน",
      fg: GOLD,
    };
  if (CTRL[eb] === ea)
    return {
      title: "ธาตุข่มกัน (" + eb + " ข่ม " + ea + ")",
      meaning: "ธาตุของคู่ข่มคุณ อาจมีจังหวะกดดันกัน ควรแบ่งบทบาทให้ชัดและเคารพพื้นที่ของกัน",
      fg: GOLD,
    };
  return {
    title: "ธาตุเป็นกลาง (" + ea + " · " + eb + ")",
    meaning: "ธาตุ" + ea + "กับธาตุ" + eb + "ไม่ก่อและไม่ข่มกันโดยตรง ความสัมพันธ์ขึ้นกับการปรับเข้าหากันเป็นหลัก",
    fg: STAR,
  };
}

export function zodiacCompatReport(aTh: string, bTh: string): Section[] {
  const ai = ZODIAC.findIndex((z) => z.th === aTh);
  const bi = ZODIAC.findIndex((z) => z.th === bTh);
  if (ai < 0 || bi < 0) return [{ kind: "note", text: "กรุณาเลือกนักษัตรทั้งสองฝ่าย" }];

  let score: number, label: string, accent: string;
  const points: { title: string; meaning: string; fg: string }[] = [];
  const sameTrine = SANHE.some((g) => g.indexOf(ai) >= 0 && g.indexOf(bi) >= 0);
  const xing = isXing(ai, bi);

  if (LIUHE[ai] === bi) {
    score = 95; label = "คู่มิตรแท้ (ลิ่วเหอ 六合) — ดีเยี่ยม"; accent = JADE;
    points.push({ title: "คู่เลขลับเกื้อหนุน", meaning: "เป็นคู่ที่ผูกพันไว้ใจกันได้ ส่งเสริมกันทั้งการงาน การเงิน และความสัมพันธ์ เป็นเนื้อคู่ที่ดี", fg: JADE });
  } else if (sameTrine && ai !== bi) {
    score = 90; label = "คู่สามัคคี (ซานเหอ 三合) — ถูกโฉลก"; accent = JADE;
    points.push({ title: "กลุ่มสามัคคี", meaning: "อยู่กลุ่มสามัคคีเดียวกัน เป้าหมายชีวิตไปทางเดียวกัน เสริมการงานและความมั่งคั่งให้กัน เหมาะเป็นหุ้นส่วนและคู่ชีวิต", fg: JADE });
  } else if (ai === bi) {
    score = 78; label = "นักษัตรเดียวกัน — เข้าใจกันดี"; accent = JADE;
    points.push({ title: "เข้าใจกันง่าย", meaning: "มีนิสัยและจังหวะชีวิตคล้ายกัน เห็นใจและคาดเดากันได้ง่าย แต่ควรระวังจุดอ่อนที่เหมือนกันจะถ่วงกันเอง", fg: JADE });
  } else if (clashOf(ai) === bi) {
    score = 42; label = "คู่ชง (ชง 沖) — ต้องปรับเข้าหากัน"; accent = RED;
    points.push({ title: "พลังปะทะ", meaning: "นักษัตรตรงข้ามกันในวงจร ความเห็นและจังหวะมักสวนทาง ถ้าเปิดใจรับความต่างได้ จะกลายเป็นแรงผลักดันที่เติมเต็มกัน", fg: RED });
  } else if (xing) {
    // 刑 (โทษทัณฑ์) มาก่อน 害 (เบียน): 刑 หนักกว่าตามตำรา — คู่ที่เป็นทั้ง 刑+害 จึงนับเป็น 刑 (50)
    // ไม่ให้คู่ 三刑 ได้คะแนนสูงกว่าคู่ 互刑 (severity inversion เดิม)
    score = 50; label = "คู่โทษ (สิง 刑) — ต้องระวังกระทบใจ"; accent = GOLD;
    points.push({ title: "โทษทัณฑ์ซึ่งกันและกัน", meaning: "เป็นคู่ที่บั่นทอนกันแบบลึก มักกระทบจิตใจมากกว่าภายนอก ต้องอาศัยความอดทนและให้เกียรติกันเป็นพิเศษ", fg: GOLD });
  } else if (HARM[ai] === bi) {
    score = 55; label = "คู่เบียน (ไฮ่ 害) — มีจุดต้องระวัง"; accent = GOLD;
    points.push({ title: "กระทบกระทั่งเล็กน้อย", meaning: "มีเรื่องจุกจิกให้ขุ่นใจเป็นครั้งคราว มักเกิดจากความเข้าใจคลาดเคลื่อน ควรสื่อสารตรงไปตรงมาและไม่เก็บสะสม", fg: GOLD });
  } else {
    score = 70; label = "เข้ากันได้ในระดับดี"; accent = GOLD;
    points.push({ title: "ความสัมพันธ์เป็นกลาง", meaning: "ไม่ส่งเสริมหรือขัดแย้งกันชัดเจน ความราบรื่นขึ้นกับการปรับตัวและความตั้งใจของทั้งคู่เป็นหลัก", fg: STAR });
  }

  // 相刑 ที่ซ้อนกับความสัมพันธ์อื่น (เช่น เสือ-ลิง เป็นทั้งชงและโทษ) — เพิ่มเป็นข้อเตือนแยก
  if (xing && score !== 50) {
    if (ai === bi)
      points.push({ title: "โทษตัวเอง (จื้อสิง 自刑)", meaning: "นักษัตรนี้เมื่ออยู่คู่กันเองมีพลังโทษตัวเองแฝง ควรเตือนกันให้พอดี อย่าซ้ำเติมจุดอ่อนของกัน", fg: GOLD });
    else
      points.push({ title: "มีโทษทัณฑ์แฝง (相刑)", meaning: "นอกจากความสัมพันธ์หลักแล้ว คู่นี้ยังมีพลังโทษทัณฑ์ซ้อนอยู่ จึงต้องระวังการกระทบใจเป็นพิเศษ", fg: GOLD });
  }

  points.push(elementPoint(ai, bi));

  const aLabel = "คุณ · " + aTh + " (" + ZODIAC[ai].animal + ")";
  const bLabel = "คู่ของคุณ · " + bTh + " (" + ZODIAC[bi].animal + ")";

  const partnership = score >= 85
    ? "ด้านความรักเป็นคู่ที่ประคองกันได้ยาว ด้านการงานเป็นหุ้นส่วนที่ไว้ใจมอบหมายงานสำคัญให้กันได้"
    : score >= 65
      ? "ด้านความรักไปกันได้ดีถ้าให้พื้นที่กัน ด้านการงานแบ่งบทบาทให้ชัดแล้วจะเสริมกันได้"
      : "ด้านความรักต้องอาศัยความเข้าใจและความอดทนสูง ด้านการงานควรตกลงกติกาให้ชัดก่อนเริ่มร่วมงาน";

  const advice = (score >= 85
    ? "เป็นคู่ที่ส่งเสริมกันอย่างดี ร่วมงานหรือใช้ชีวิตด้วยกันแล้วเจริญรุ่งเรือง ช่วยกันได้ทั้งการงานและการเงิน"
    : score >= 65
      ? "เข้ากันได้ในระดับน่าพอใจ หากเปิดใจรับความต่างของกัน จะอยู่ด้วยกันได้ราบรื่นและยืนยาว"
      : "มีพลังที่ต้องปรับเข้าหากัน ความต่างจะกลายเป็นแรงเสริมได้ถ้าสื่อสารตรงไปตรงมาและให้พื้นที่กัน")
    + " " + partnership;

  return [
    { kind: "compat", score, label, a: aTh + " " + ZODIAC[ai].cn, b: bTh + " " + ZODIAC[bi].cn, accent, points },
    {
      kind: "grid", title: "นิสัยของแต่ละนักษัตร", glyph: "肖", cells: [
        { name: aLabel, value: ZODIAC[ai].cn, note: ZODIAC[ai].tr },
        { name: bLabel, value: ZODIAC[bi].cn, note: ZODIAC[bi].tr },
      ],
    },
    {
      kind: "grid", title: "ธาตุประจำนักษัตร", glyph: "行", accent, cells: [
        { name: aLabel, value: BRANCH_EL[ai], note: "ธาตุประจำก้านดิน" + ZODIAC[ai].cn },
        { name: bLabel, value: BRANCH_EL[bi], note: "ธาตุประจำก้านดิน" + ZODIAC[bi].cn },
      ],
    },
    { kind: "prose", title: "คำแนะนำสำหรับคู่นี้", glyph: "合", accent, paras: [{ t: advice }] },
    { kind: "note", text: "อ้างอิงปฏิสัมพันธ์นักษัตรตามโหราศาสตร์จีนคลาสสิก ได้แก่ สามัคคี (ซานเหอ 三合), มิตร (ลิ่วเหอ 六合), ชง (沖), เบียน (ไฮ่ 害) และโทษ (สิง 刑)" },
  ];
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return zodiacCompatReport((vals[0] ?? "").trim(), (vals[1] ?? "").trim());
  },
};
