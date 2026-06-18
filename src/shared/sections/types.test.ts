import { describe, it, expect } from "vitest";
import { SectionSchema, ReportSchema, TONE_HEX, type Section } from "./types";

const oneOfEach: Section[] = [
  { kind: "verdict", score: 86, grade: "A", gradeLabel: "ดีมาก", summary: "เบอร์โดดเด่นด้านการเงิน", meta: "ผลรวม 54", accent: "#6cc18a", hideRing: false },
  { kind: "rows", title: "คู่เลข", glyph: "號", items: [{ n: "56", title: "ทรัพย์", meaning: "ดึงดูดเงินทอง", fg: "#6cc18a" }] },
  { kind: "blocks", title: "ด้านชีวิต", glyph: "命", items: [{ title: "การเงิน", tag: "เด่น", accent: "#6cc18a", text: "หนุนรายรับ", chips: ["ค้าขาย", "ลงทุน"] }] },
  { kind: "grid", title: "สี่เสา", glyph: "柱", accent: "#7da6d8", cells: [{ name: "เสาวัน", value: "甲子", note: "ธาตุไม้" }] },
  { kind: "cards", title: "เลขแนะนำ", glyph: "尋", subtitle: "คัดผลรวมเกรด A", accent: "#6cc18a", items: [{ value: "089-356-9789", badge: "A+", note: "ผลรวม 64" }] },
  { kind: "swatches", title: "สีมงคล", glyph: "色", tag: "เสริมการงาน", accent: "#d8a64a", text: "สวมโทนทองเสริมบารมี", items: [{ name: "ทอง", hex: "#d8a64a" }] },
  { kind: "prose", title: "ภาพรวม", glyph: "文", accent: "#7da6d8", paras: [{ h: "ลัคนา", t: "ลัคนาสถิตราศีเมษ" }, { t: "ไม่มีหัวข้อย่อย" }] },
  { kind: "compat", score: 78, label: "เข้ากันดี", a: "วันจันทร์", b: "วันศุกร์", accent: "#c98ad8", points: [{ title: "ธาตุ", meaning: "เสริมกัน", fg: "#6cc18a" }] },
  { kind: "note", text: "กรอกเบอร์ให้ครบ แล้วลองใหม่" },
];

describe("SectionSchema / ReportSchema", () => {
  it("parses one section of every kind", () => {
    for (const s of oneOfEach) {
      expect(() => SectionSchema.parse(s)).not.toThrow();
    }
  });

  it("ReportSchema accepts an array with all kinds", () => {
    expect(() => ReportSchema.parse(oneOfEach)).not.toThrow();
  });

  it("ReportSchema rejects an empty array (min 1)", () => {
    expect(() => ReportSchema.parse([])).toThrow();
  });

  it("rejects an unknown kind", () => {
    expect(() => SectionSchema.parse({ kind: "bogus", x: 1 })).toThrow();
  });

  it("rejects a verdict missing required score", () => {
    expect(() => SectionSchema.parse({ kind: "verdict", grade: "A", gradeLabel: "ดี", summary: "x" })).toThrow();
  });

  it("rejects optional fields with the wrong type (hideRing as string)", () => {
    expect(() =>
      SectionSchema.parse({ kind: "verdict", score: 80, grade: "A", gradeLabel: "ดี", summary: "x", hideRing: "yes" }),
    ).toThrow();
  });

  it("exposes the frozen tone hex map", () => {
    expect(TONE_HEX).toEqual({ good: "#6cc18a", warn: "#d8a64a", bad: "#e0584b", info: "#7da6d8" });
  });
});
