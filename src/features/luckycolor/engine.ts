import type { Section } from "../../shared/sections/types";
import { DAY_LORD, swatch } from "../_shared/thaiAstro";

const JADE = "#6cc18a";
const GOLD = "#d8a64a";
const RED = "#e0584b";

export function luckyColorReport(dayLabel: string, aspect: string): Section[] {
  const info = DAY_LORD[dayLabel] || DAY_LORD["อาทิตย์"];
  const aspMap: Record<string, string[]> = {
    การงาน: info.work,
    การเงิน: info.money,
    ความรัก: info.love,
    สุขภาพ: info.color,
    เมตตามหานิยม: info.luck,
  };
  const asp = aspMap[aspect] || info.luck;
  const secs: Section[] = [];
  secs.push({
    kind: "swatches",
    title: "สีมงคลประจำวัน" + dayLabel,
    glyph: "彩",
    tag: "ใส่แล้วรุ่ง",
    accent: JADE,
    text:
      "สีพื้นฐานที่เสริมดวงชะตาของคนเกิดวัน" +
      dayLabel +
      " — ใส่เป็นเสื้อผ้า เครื่องประดับ หรือของใช้ประจำวัน",
    items: swatch(info.color),
  });
  secs.push({
    kind: "swatches",
    title: "สีเสริม" + (aspect || "เมตตามหานิยม"),
    glyph: "吉",
    tag: aspect || "เมตตา",
    accent: GOLD,
    text: "เน้นใส่/พกสีเหล่านี้เมื่ออยากเสริมด้านที่เลือก",
    items: swatch(asp),
  });
  secs.push({
    kind: "swatches",
    title: "สีกาลกิณี (ควรเลี่ยง)",
    glyph: "凶",
    tag: "หลีกเลี่ยง",
    accent: RED,
    text:
      "สีที่บั่นทอนดวงของคนเกิดวันนี้ ควรเลี่ยงในวันสำคัญหรือวันที่ต้องการความมั่นใจ",
    items: swatch(info.avoid),
  });
  secs.push({
    kind: "grid",
    title: "สีเสริมแยกตามด้าน",
    glyph: "色",
    cells: [
      { name: "การงาน", value: info.work.join(" · "), note: "หน้าที่ ตำแหน่ง" },
      { name: "การเงิน", value: info.money.join(" · "), note: "โชคลาภ รายได้" },
      { name: "ความรัก", value: info.love.join(" · "), note: "เสน่ห์ คู่ครอง" },
      {
        name: "เมตตามหานิยม",
        value: info.luck.join(" · "),
        note: "คนรักใคร่ อุปถัมภ์",
      },
    ],
  });
  secs.push({
    kind: "note",
    text: "สีมงคลประจำวันเป็นคติความเชื่อโหราศาสตร์ไทย ตำราต่าง ๆ อาจกำหนดสีต่างกันได้เล็กน้อย",
  });
  return secs;
}
