import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { letterBucketMap, taksaForDay } from "../../features/_shared/taksa";
import { gradeOf } from "../../features/_shared/numerology";
import { TONE } from "./content";
import { numerologySections } from "./numerology";

const BHUMI_ORDER = [
  "เดช",
  "ศรี",
  "มูละ",
  "มนตรี",
  "อุตสาหะ",
  "บริวาร",
  "อายุ",
  "กาลกิณี",
] as const;

function descFor(dayLabel: string, bhumi: string): string {
  const t = taksaForDay(dayLabel);
  const hit = t.find((x) => x.bhumi === bhumi);
  return hit ? hit.desc : "";
}

function toneFor(k: string): string {
  return k === "good" ? TONE.good : k === "bad" ? TONE.bad : TONE.info;
}

export function analyzeNameTaksa(first: string, last: string, dayLabel: string): Section[] {
  if (!first) return [{ kind: "note", text: "กรุณากรอกชื่อจริงเพื่อวิเคราะห์" }];
  const day = dayLabel || "อาทิตย์";
  const map = letterBucketMap(day);
  // Do not strip vowels - the above/below vowels are in the Sun group on the wheel and must count (Monday-born = vowel-group kalakini)
  // Tone marks / pinthu not on the wheel are already skipped by the map lookup (if !info)
  const full = first + (last || "");

  const counts: Record<string, number> = {
    เดช: 0,
    ศรี: 0,
    มูละ: 0,
    มนตรี: 0,
    อุตสาหะ: 0,
    บริวาร: 0,
    อายุ: 0,
    กาลกิณี: 0,
  };
  const kalaFound: string[] = [];
  const goodFound: string[] = [];
  const perLetter: { ch: string; bhumi: string; k: string }[] = [];

  for (const ch of full) {
    const info = map[ch];
    if (!info) continue;
    counts[info.bhumi] = (counts[info.bhumi] || 0) + 1;
    perLetter.push({ ch, bhumi: info.bhumi, k: info.k });
    if (info.bhumi === "กาลกิณี") {
      if (kalaFound.indexOf(ch) < 0) kalaFound.push(ch);
    } else if (info.k === "good") {
      if (goodFound.indexOf(ch) < 0) goodFound.push(ch);
    }
  }

  const goodN =
    counts["เดช"] + counts["ศรี"] + counts["มูละ"] + counts["มนตรี"] + counts["อุตสาหะ"];
  let score = 70 + goodN * 4 - kalaFound.length * 14;
  score = Math.max(25, Math.min(96, score));
  const gr = gradeOf(score);

  const secs: Section[] = [];
  secs.push({
    kind: "verdict",
    score,
    grade: gr.g,
    gradeLabel: kalaFound.length ? "มีอักษรกาลกิณี" : gr.l,
    accent: kalaFound.length ? TONE.bad : score >= 75 ? TONE.good : TONE.warn,
    summary: kalaFound.length
      ? "ชื่อนี้มีอักษรกาลกิณีของคนเกิดวัน" +
        day +
        " " +
        kalaFound.length +
        " ตัว (" +
        kalaFound.join(" ") +
        ") ซึ่งตามตำราควรเลี่ยง"
      : "ชื่อนี้ไม่มีอักษรกาลกิณีของคนเกิดวัน" +
        day +
        (goodN ? " และมีอักษรมงคลหนุน " + goodN + " ตัว" : " (อักษรส่วนใหญ่อยู่หมู่กลาง)"),
    meta: "วิเคราะห์ด้วยหลักทักษา: เทียบทุกพยัญชนะในชื่อกับหมู่อักษรประจำวันเกิด",
  });

  if (perLetter.length) {
    secs.push({
      kind: "rows",
      title: "อักษรแต่ละตัวในชื่ออยู่ภูมิใด",
      glyph: "字",
      items: perLetter.map((p) => ({
        n: p.ch,
        title: p.bhumi,
        meaning:
          (p.bhumi === "กาลกิณี"
            ? "อักษรกาลกิณี ควรเลี่ยง — "
            : p.k === "good"
              ? "อักษรมงคล — "
              : "อักษรกลาง — ") + descFor(day, p.bhumi),
        fg: toneFor(p.k),
      })),
    });
  }

  if (kalaFound.length) {
    secs.push({
      kind: "blocks",
      title: "อักษรกาลกิณีที่พบในชื่อ",
      glyph: "忌",
      items: [
        {
          title: "ควรพิจารณาเปลี่ยน",
          tag: "กาลกิณี",
          accent: TONE.bad,
          text:
            "พยัญชนะเหล่านี้เป็นกาลกิณีของคนเกิดวัน" +
            day +
            " การมีอยู่ในชื่ออาจบั่นทอนดวงตามคติทักษา",
          chips: kalaFound,
        },
      ],
    });
  }
  if (goodFound.length) {
    secs.push({
      kind: "blocks",
      title: "อักษรมงคลในชื่อ",
      glyph: "吉",
      items: [
        {
          title: "อักษรเสริมดวงที่มีอยู่",
          tag: "ดี",
          accent: TONE.good,
          text: "พยัญชนะเหล่านี้อยู่ในกลุ่มเดช/ศรี/มูละ/มนตรี/อุตสาหะ ซึ่งหนุนดวงชะตา",
          chips: goodFound,
        },
      ],
    });
  }

  const cells = BHUMI_ORDER.filter((k) => counts[k] > 0).map((k) => ({
    name: k,
    value: counts[k] + " ตัว",
    note: descFor(day, k),
  }));
  secs.push({ kind: "grid", title: "อักษรในชื่อจัดอยู่ภูมิใดบ้าง", glyph: "宮", cells });

  const guidance: { h?: string; t: string }[] = [];
  if (kalaFound.length) {
    guidance.push({
      h: "ข้อสรุป: ควรพิจารณาปรับชื่อ",
      t:
        "ชื่อนี้มีอักษรกาลกิณีของคนเกิดวัน" +
        day +
        " " +
        kalaFound.length +
        " ตัว (" +
        kalaFound.join(" ") +
        ") ตามคติทักษาถือว่าเป็นอักษรอัปมงคลที่ควรเลี่ยง หากปรับได้แนะนำให้เปลี่ยนหรือตัดอักษรเหล่านี้ออก แล้วเลือกอักษรหมู่เดช ศรี หรือมนตรีแทน",
    });
  } else {
    guidance.push({
      h: "ข้อสรุป: ชื่อนี้ใช้ได้ตามหลักทักษา",
      t:
        "ชื่อนี้ไม่มีอักษรกาลกิณีของคนเกิดวัน" +
        day +
        (goodN
          ? " และมีอักษรหมู่มงคลหนุนอยู่ " + goodN + " ตัว ถือว่าเหมาะสมตามคติทักษา ไม่จำเป็นต้องเปลี่ยน"
          : " ถือว่าผ่านเกณฑ์พื้นฐาน แม้อักษรส่วนใหญ่จะอยู่หมู่กลาง (บริวาร อายุ) ก็ไม่ถือเป็นโทษ"),
    });
  }
  guidance.push({
    h: "ก่อนตัดสินใจเปลี่ยนชื่อ",
    t: "หลักทักษาเป็นเพียงปัจจัยหนึ่ง ควรพิจารณาความหมายของชื่อ เสียงเรียก และความผูกพันประกอบด้วย หากต้องการชื่อใหม่ที่ปลอดอักษรกาลกิณีของวันเกิด สามารถใช้เมนูแนะนำชื่อมงคลเพื่อดูตัวเลือกที่ผ่านการคัดกรองแล้ว",
  });
  secs.push({
    kind: "prose",
    title: "คำแนะนำ: เก็บชื่อเดิมหรือเปลี่ยน",
    glyph: "断",
    accent: kalaFound.length ? TONE.bad : TONE.good,
    paras: guidance,
  });

  secs.push({
    kind: "note",
    text: "ผลวิเคราะห์ทักษา (อักษรมงคล/กาลกิณีตามวันเกิด) คำนวณได้แน่นอนจากตำรา ส่วนเลขศาสตร์ด้านล่างเป็นข้อมูลประกอบ",
  });
  secs.push(...numerologySections(first, last || ""));
  return secs;
}

export const nameanalyzeEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return analyzeNameTaksa(vals[0] ?? "", vals[1] ?? "", vals[2] ?? "");
  },
};
