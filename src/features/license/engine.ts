import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { TONE_HEX } from "../../shared/sections/types";
import { numberReport } from "../_shared/numerology";
import { plateCombinedSum, THAI_PLATE_CONVENTION } from "./content";

const STAR = TONE_HEX.info;
const JADE = TONE_HEX.good;

export const licenseEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const plate = vals[0] || "";
    const province = vals[1] || "";
    const secs = numberReport(plate, "ทะเบียน", "車");
    if (secs.length === 1 && secs[0].kind === "note") return secs;

    const c = plateCombinedSum(plate);
    const letterDisp = c.letters.length
      ? c.letters.map((l) => l.ch + "=" + l.value).join(" · ")
      : "—";

    const inserts: Section[] = [];

    if (c.letters.length) {
      inserts.push({
        kind: "rows",
        title: "ค่าพยัญชนะบนป้าย (แยกตัว)",
        glyph: "字",
        items: c.letters.map((l) => ({
          n: l.ch,
          title: "ค่า = " + l.value,
          meaning: "พยัญชนะ " + l.ch + " มีค่าเลขศาสตร์เท่ากับ " + l.value + " (ตาราง ก=1)",
          fg: STAR,
        })),
      });
    }

    inserts.push({
      kind: "grid",
      title: "ค่าตัวอักษร & ผลรวมรวมของป้าย",
      glyph: "字",
      accent: STAR,
      cells: [
        { name: "ค่าตัวอักษร", value: letterDisp, note: "ตามตาราง ก=1" },
        { name: "รวมค่าตัวอักษร", value: String(c.letterValueSum), note: "ผลบวกพยัญชนะ" },
        { name: "รวมตัวเลขบนป้าย", value: String(c.digitSum), note: "ผลบวกเลขล้วน" },
        { name: "ผลรวมรวม", value: String(c.combinedSum), note: "ตัวอักษร + ตัวเลข" },
        ...(province ? [{ name: "จังหวัด", value: province, note: "ป้ายจดทะเบียน" }] : []),
      ],
    });

    const partsLine = c.letters.length
      ? "ป้ายนี้คิดจากค่าพยัญชนะ " +
        c.letters.map((l) => l.ch + "(" + l.value + ")").join(" + ") +
        " รวม " +
        c.letterValueSum +
        " บวกกับผลรวมตัวเลขบนป้าย " +
        c.digitSum +
        " จึงได้ผลรวมรวม " +
        c.combinedSum
      : "ป้ายนี้ไม่มีพยัญชนะที่อยู่ในตารางค่าเลขศาสตร์ จึงคิดจากผลรวมตัวเลขบนป้าย " +
        c.digitSum +
        " เป็นหลัก (ผลรวมรวม " +
        c.combinedSum +
        ")";

    inserts.push({
      kind: "prose",
      title: "อ่านป้ายทะเบียนนี้",
      glyph: "車",
      accent: JADE,
      paras: [
        { h: "ที่มาของผลรวม", t: partsLine },
        {
          t: "การให้คะแนนด้านบนพิจารณาจากตัวเลขบนป้ายเป็นหลัก (คู่เลขติดกันและผลรวม) ส่วนค่าพยัญชนะเป็นองค์ประกอบเสริมที่ช่วยปรับผลรวมรวมของทั้งป้าย",
        },
        {
          t: "ในทางปฏิบัติ ทะเบียนที่คนเห็นและจดจำคือเลขท้าย หากเลือกได้ ควรให้คู่เลขท้ายเป็นคู่ที่ดีก่อน แล้วจึงดูผลรวมรวมประกอบ ส่วนหมวดอักษรนั้นกรมการขนส่งทางบกกำหนดเรียงตามลำดับ ไม่ได้สื่อความหมายมงคลโดยตรง แต่ค่าตัวเลขของพยัญชนะยังนับรวมในผลรวมตามตำรา",
        },
      ],
    });

    inserts.push({ kind: "note", text: THAI_PLATE_CONVENTION });

    secs.splice(secs.length - 1, 0, ...inserts);
    return secs;
  },
};
