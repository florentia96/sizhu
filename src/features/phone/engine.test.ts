import { describe, it, expect } from "vitest";
import { engine } from "./engine";
import { analyzeNumber } from "../_shared/numerology";
import { ReportSchema } from "../../shared/sections/types";

describe("phone engine", () => {
  // Hand-traced reference vector — overlapping (sliding-window) pairs against PAIRS:
  // 08(bad) 81(warn) 12(-) 23(good) 34(warn) 45(good) 56(good) 67(-) 78(-)
  // good=3 warn=2 bad=1 · total=44 · SUM_GOOD[44] => sumQual good (+13)
  // score = 62 + 3*6 - 1*9 - 2*3 + 13 = 78 -> grade A
  const REF = "0812345678";

  it("matches the hand-computed reference analysis", () => {
    const a = analyzeNumber(REF);
    expect(a.good).toBe(3);
    expect(a.warn).toBe(2);
    expect(a.bad).toBe(1);
    expect(a.total).toBe(44);
    expect(a.sumQual).toBe("good");
    expect(a.score).toBe(78);
  });

  it("produces a verdict with score 78 / grade A exactly", () => {
    const r = engine.build([REF]);
    const verdict = r.find((s) => s.kind === "verdict");
    if (!verdict || verdict.kind !== "verdict") throw new Error("no verdict");
    expect(verdict.score).toBe(78);
    expect(verdict.grade).toBe("A");
    expect(verdict.gradeLabel).toBe("ดีมาก");
  });

  it("emits verdict + rows + grid + prose + note", () => {
    const kinds = engine.build([REF]).map((s) => s.kind);
    expect(kinds).toContain("verdict");
    expect(kinds).toContain("rows");
    expect(kinds).toContain("grid");
    expect(kinds).toContain("prose");
    expect(kinds).toContain("note");
  });

  it("threads the 'เบอร์โทร' label into the verdict summary", () => {
    const r = engine.build([REF]);
    const verdict = r.find((s) => s.kind === "verdict");
    expect(verdict && "summary" in verdict && verdict.summary.startsWith("เบอร์โทร")).toBe(true);
  });

  it("output satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(engine.build([REF]))).not.toThrow();
  });

  it("returns a guidance note for too-short input (schema-valid)", () => {
    const r = engine.build(["7"]);
    expect(r).toEqual([
      { kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" },
    ]);
    expect(() => ReportSchema.parse(r)).not.toThrow();
  });

  it("is deterministic", () => {
    expect(engine.build([REF])).toEqual(engine.build([REF]));
  });
});
