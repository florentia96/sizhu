import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { taksaForDay } from "../../features/_shared/taksa";
import { TONE } from "./content";

function buildKalakini(dayLabel: string): Section[] {
  const day = dayLabel || "อาทิตย์";
  const t = taksaForDay(day); // t[0]=บริวาร ... t[7]=กาลกิณี
  const kala = t[7];
  const dech = t[2];
  const sri = t[3];
  const montri = t[6];

  const blocks: { title: string; tag: string; accent: string; text: string; chips: string[] }[] = [
    {
      title: "อักษรกาลกิณี (ห้ามใช้ในชื่อ)",
      tag: "หลีกเลี่ยง",
      accent: TONE.bad,
      text:
        "พยัญชนะ/สระกลุ่ม " +
        kala.planet +
        " เป็นกาลกิณีของคนเกิดวัน" +
        day +
        " ควรเลี่ยงใช้เป็นตัวสะกดหรือพยัญชนะในชื่อ",
      chips: kala.letters.slice(),
    },
    {
      title: "อักษรเดช (เสริมอำนาจบารมี)",
      tag: "เสริมดวง",
      accent: TONE.good,
      text: dech.desc,
      chips: dech.letters.slice(),
    },
    {
      title: "อักษรศรี (เสริมเสน่ห์-ทรัพย์)",
      tag: "เสริมดวง",
      accent: TONE.warn,
      text: sri.desc,
      chips: sri.letters.slice(),
    },
    {
      title: "อักษรมนตรี (ผู้ใหญ่อุปถัมภ์)",
      tag: "เสริมดวง",
      accent: TONE.info,
      text: montri.desc,
      chips: montri.letters.slice(),
    },
  ];

  const secs: Section[] = [];
  secs.push({
    kind: "prose",
    title: "ทักษาประจำวัน" + day,
    glyph: "忌",
    paras: [
      {
        t: "ตามหลักทักษาปกรณ์ หมู่อักษรทั้ง 8 จะวางบนวงล้อ โดยเริ่มนับ \"บริวาร\" ที่ดาวประจำวันเกิด แล้วไล่ไปจนถึง \"กาลกิณี\" ซึ่งเป็นอักษรอัปมงคลที่ควรเลี่ยง",
      },
    ],
  });
  secs.push({ kind: "blocks", title: "อักษรเสริม & อักษรต้องห้าม", glyph: "字", items: blocks });
  secs.push({
    kind: "grid",
    title: "ครบทั้ง 8 ภูมิทักษา",
    glyph: "宮",
    cells: t.map((x) => ({ name: x.bhumi + " · " + x.planet, value: x.letters.join(" "), note: x.desc })),
  });
  secs.push({
    kind: "note",
    text: "คำนวณตามวงล้อทักษาปกรณ์ (อัฐเคราะห์) แบบมาตรฐาน · ผู้ที่เกิดวันพุธกลางคืนให้ใช้ฐานราหู",
  });
  return secs;
}

export const kalakiniEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return buildKalakini(vals[0] ?? "");
  },
};
