import type { Section, Tone } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { taksaForDay } from "../../features/_shared/taksa";
import type { BhumiCell } from "../../features/_shared/taksa";
import { TONE } from "./content";

const TONE_BY_KEY: Record<Tone, string> = {
  good: TONE.good,
  warn: TONE.warn,
  bad: TONE.bad,
  info: TONE.info,
};

// Short label per bhumi, shown on each block's tag (English-Thai by role position)
const BHUMI_TAG: Record<string, string> = {
  บริวาร: "ผู้สนับสนุน",
  อายุ: "สุขภาพ",
  เดช: "อำนาจ",
  ศรี: "เสน่ห์-ทรัพย์",
  มูละ: "รากฐาน",
  อุตสาหะ: "ความเพียร",
  มนตรี: "ผู้อุปถัมภ์",
  กาลกิณี: "หลีกเลี่ยง",
};

function blockFor(cell: BhumiCell): {
  title: string;
  tag: string;
  accent: string;
  text: string;
  chips: string[];
} {
  const isKala = cell.bhumi === "กาลกิณี";
  const title = "อักษร" + cell.bhumi + " (ดาว" + cell.planet + ")";
  const text = isKala
    ? cell.desc + " — เป็นกาลกิณีของคนเกิดวันนี้ ไม่ควรใช้เป็นพยัญชนะหรือตัวสะกดในชื่อ"
    : cell.desc;
  return {
    title,
    tag: BHUMI_TAG[cell.bhumi] ?? cell.bhumi,
    accent: TONE_BY_KEY[cell.k],
    text,
    chips: cell.letters.slice(),
  };
}

function buildKalakini(dayLabel: string): Section[] {
  const day = dayLabel || "อาทิตย์";
  const t = taksaForDay(day); // t[0]=borriwan ... t[7]=kalakini
  const kala = t[7];
  const auspicious = t.filter((x) => x.k === "good"); // decha, sri, moola, utsaha, montri
  const kalaLetters = kala.letters.join(" ");

  const secs: Section[] = [];

  // 1) Key summary - highlights the kalakini letters to avoid first
  secs.push({
    kind: "verdict",
    score: 0,
    grade: "忌",
    gradeLabel: "อักษรกาลกิณี",
    accent: TONE.bad,
    hideRing: true,
    summary:
      "คนเกิดวัน" +
      day +
      " มีกาลกิณีตกที่หมู่อักษรของดาว" +
      kala.planet +
      " คือ " +
      kalaLetters +
      " ตามตำราทักษาควรเลี่ยงใช้พยัญชนะกลุ่มนี้เป็นตัวต้นชื่อหรือตัวสะกด",
    meta: "ทักษาประจำวัน" + day + " · เริ่มนับบริวารที่ดาว" + t[0].planet,
  });

  // 2) Source / principle
  secs.push({
    kind: "prose",
    title: "หลักทักษาประจำวัน" + day,
    glyph: "忌",
    paras: [
      {
        t:
          "ตามหลักทักษาปกรณ์ หมู่อักษรทั้ง 8 วางบนวงล้ออัฐเคราะห์ โดยเริ่มนับภูมิแรก “บริวาร” ที่ดาวประจำวันเกิด แล้วไล่ตามวงล้อไปจนถึงภูมิที่ 8 “กาลกิณี” ซึ่งเป็นหมู่อักษรอัปมงคลที่ควรเลี่ยงเมื่อนำไปตั้งชื่อ",
      },
      {
        h: "ลำดับ 8 ภูมิ",
        t: "บริวาร อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี (เรียงตามวงล้อจากดาวประจำวันเกิด)",
      },
    ],
  });

  // 3) All 8 bhumi with letters + meaning (colored by bhumi quality)
  secs.push({
    kind: "blocks",
    title: "หมู่อักษรครบทั้ง 8 ภูมิ",
    glyph: "字",
    items: t.map(blockFor),
  });

  // 4) Practical advice when using it to name
  const auspiciousNames = auspicious.map((x) => x.bhumi).join(" ");
  secs.push({
    kind: "prose",
    title: "แนวทางใช้ตั้งชื่อ",
    glyph: "名",
    paras: [
      {
        h: "อักษรที่ควรเลี่ยง",
        t:
          "เลี่ยงพยัญชนะกาลกิณีกลุ่มดาว" +
          kala.planet +
          " (" +
          kalaLetters +
          ") โดยเฉพาะตำแหน่งพยัญชนะต้นและตัวสะกด ส่วนสระและวรรณยุกต์มักไม่นับเป็นกาลกิณี ยกเว้นกรณีกาลกิณีตกที่หมู่สระของดาวอาทิตย์",
      },
      {
        h: "อักษรที่ควรเสริม",
        t:
          "เลือกพยัญชนะจากหมู่มงคล " +
          auspiciousNames +
          " เพื่อหนุนด้านที่ต้องการ เช่น เดชเสริมอำนาจบารมี ศรีเสริมเสน่ห์และทรัพย์ มนตรีเสริมผู้ใหญ่อุปถัมภ์",
      },
      {
        t:
          "หลักทักษาเป็นเกณฑ์เรื่องหมู่อักษรตามวันเกิด สามารถใช้ร่วมกับการตรวจเลขศาสตร์ของชื่อเพื่อพิจารณาประกอบกันได้",
      },
    ],
  });

  // 5) Compact reference table
  secs.push({
    kind: "grid",
    title: "ตารางอ้างอิง 8 ภูมิ",
    glyph: "宮",
    cells: t.map((x) => ({
      name: x.bhumi + " · " + x.planet,
      value: x.letters.join(" "),
      note: x.desc,
    })),
  });

  secs.push({
    kind: "note",
    text:
      "คำนวณตามวงล้อทักษาปกรณ์ (อัฐเคราะห์) แบบมาตรฐาน ผู้ที่เกิดวันพุธตั้งแต่ 18:00 (พุธกลางคืน) ให้ใช้ฐานราหู ตำราบางสำนักอาจกำหนดรายละเอียดต่างกันเล็กน้อย",
  });
  return secs;
}

export const kalakiniEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return buildKalakini(vals[0] ?? "");
  },
};
