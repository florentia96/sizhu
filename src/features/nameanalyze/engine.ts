import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { letterBucketMap, taksaForDay } from "../../features/_shared/taksa";
import { gradeOf } from "../../features/_shared/numerology";
import { TONE } from "./content";
import { numerologySections } from "./numerology";

const STRIP_RE = /[\sัิ-ฺ็-๎]/g; // วรรณยุกต์ + สระบน-ล่าง → เหลือพยัญชนะ + สระเด่น

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

export function analyzeNameTaksa(first: string, last: string, dayLabel: string): Section[] {
  if (!first) return [{ kind: "note", text: "กรุณากรอกชื่อจริงเพื่อวิเคราะห์" }];
  const day = dayLabel || "อาทิตย์";
  const map = letterBucketMap(day);
  const full = (first + (last || "")).replace(STRIP_RE, "");

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

  for (const ch of full) {
    const info = map[ch];
    if (!info) continue;
    counts[info.bhumi] = (counts[info.bhumi] || 0) + 1;
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
        " และมีอักษรมงคลหนุน " +
        goodN +
        " ตัว",
    meta: "วิเคราะห์ด้วยหลักทักษา: เทียบทุกพยัญชนะในชื่อกับหมู่อักษรประจำวันเกิด",
  });

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
  secs.push({
    kind: "note",
    text: "วิเคราะห์ตามหลักทักษา (อักษรมงคล/กาลกิณีตามวันเกิด) ซึ่งคำนวณได้แน่นอน",
  });
  secs.push(...numerologySections(first, last || ""));
  return secs;
}

export const nameanalyzeEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return analyzeNameTaksa(vals[0] ?? "", vals[1] ?? "", vals[2] ?? "");
  },
};
