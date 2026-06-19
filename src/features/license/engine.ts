import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { numberReport } from "../_shared/numerology";
import { plateCombinedSum, THAI_PLATE_CONVENTION } from "./content";

const STAR = "#7da6d8";

export const licenseEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const plate = vals[0] || "";
    const province = vals[1] || "";
    const secs = numberReport(plate, "ทะเบียน", "車");
    if (secs.length === 1 && secs[0].kind === "note") return secs;

    const c = plateCombinedSum(plate);
    const letterDisp = c.letters.length ? c.letters.map((l) => l.ch + "=" + l.value).join(" · ") : "—";

    const grid: Section = {
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
    };

    secs.splice(secs.length - 1, 0, grid, { kind: "note", text: THAI_PLATE_CONVENTION });
    return secs;
  },
};
