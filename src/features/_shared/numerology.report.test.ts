import { describe, it, expect } from "vitest";
import { gradeOf, numberReport } from "./numerology";
import { ReportSchema } from "../../shared/sections/types";

describe("gradeOf boundaries", () => {
  it("maps every threshold exactly", () => {
    expect(gradeOf(86)).toEqual({ g: "A+", l: "มงคลยอดเยี่ยม" });
    expect(gradeOf(85)).toEqual({ g: "A", l: "ดีมาก" });
    expect(gradeOf(78)).toEqual({ g: "A", l: "ดีมาก" });
    expect(gradeOf(77)).toEqual({ g: "B+", l: "ดี" });
    expect(gradeOf(70)).toEqual({ g: "B+", l: "ดี" });
    expect(gradeOf(69)).toEqual({ g: "B", l: "ค่อนข้างดี" });
    expect(gradeOf(62)).toEqual({ g: "B", l: "ค่อนข้างดี" });
    expect(gradeOf(61)).toEqual({ g: "C", l: "ปานกลาง" });
    expect(gradeOf(52)).toEqual({ g: "C", l: "ปานกลาง" });
    expect(gradeOf(51)).toEqual({ g: "D", l: "ควรพิจารณา" });
    expect(gradeOf(42)).toEqual({ g: "D", l: "ควรพิจารณา" });
    expect(gradeOf(41)).toEqual({ g: "E", l: "ควรเลี่ยง" });
    expect(gradeOf(22)).toEqual({ g: "E", l: "ควรเลี่ยง" });
  });
});

describe("numberReport", () => {
  it("returns a single note when fewer than 2 digits", () => {
    const r = numberReport("7");
    expect(r).toHaveLength(1);
    expect(r[0]).toEqual({ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" });
    expect(() => ReportSchema.parse(r)).not.toThrow();
  });

  it("output satisfies ReportSchema", () => {
    const r = numberReport("0812345678", "เบอร์โทร", "數");
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(r.length).toBeGreaterThan(1);
  });

  it("threads label into the verdict summary and glyph into the rows section", () => {
    const r = numberReport("0812345678", "เบอร์โทร", "數");
    const verdict = r.find((s) => s.kind === "verdict");
    const rows = r.find((s) => s.kind === "rows");
    expect(verdict && "summary" in verdict && verdict.summary.startsWith("เบอร์โทร")).toBe(true);
    expect(rows && "glyph" in rows && rows.glyph).toBe("數");
  });

  it("orders deduped pair rows bad > warn > good (first-seen within tone)", () => {
    const r = numberReport("0812345678", "เบอร์โทร", "數");
    const rows = r.find((s) => s.kind === "rows");
    if (!rows || rows.kind !== "rows") throw new Error("no rows");
    expect(rows.items.map((it) => it.n)).toEqual(["08", "81", "34", "23", "45", "56"]);
  });

  it("is deterministic", () => {
    expect(numberReport("0812345678", "เบอร์โทร", "數")).toEqual(
      numberReport("0812345678", "เบอร์โทร", "數"),
    );
  });
});
