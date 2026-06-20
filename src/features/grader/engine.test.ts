import { describe, it, expect } from "vitest";
import { graderMeta } from "./meta";
import { graderFields } from "./fields";
import { graderEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("grader meta + fields", () => {
  it("meta has correct id and group-ready shape", () => {
    expect(graderMeta.id).toBe("grader");
    expect(graderMeta.name).toBeTruthy();
    expect(graderMeta.cn).toBeTruthy();
    expect(graderMeta.desc).toBeTruthy();
    expect(graderMeta.long).toBeTruthy();
  });
  it("fields = single free-number text input", () => {
    expect(graderFields).toHaveLength(1);
    expect(graderFields[0].type).toBe("text");
    expect(graderFields[0].label).toBe("เลขที่ต้องการตรวจ");
  });
  it("enforces the numeric input contract (maxLength 15, numeric, hint+placeholder)", () => {
    const f = graderFields[0];
    if (f.type !== "text") throw new Error("grader field must be type text");
    expect(f.maxLength).toBe(15);
    expect(f.inputMode).toBe("numeric");
    expect(f.placeholder).toBe("เช่น 0812345678 หรือ 1234");
    expect(f.hint).toBe("กรอกเฉพาะตัวเลข เช่น เบอร์โทร เลขบัญชี หรือเลขเด็ด");
  });
  it("keeps user-facing copy polite-neutral (no ครับ/ค่ะ/slang particles)", () => {
    const f = graderFields[0];
    const copy = [
      graderMeta.name,
      graderMeta.desc,
      graderMeta.long,
      f.label,
      f.type === "text" ? f.placeholder : "",
      "hint" in f ? f.hint : "",
    ].join(" ");
    expect(copy).not.toMatch(/ครับ|ค่ะ|นะคะ|จ้า|จ๊ะ/);
  });
});

describe("grader engine", () => {
  it("output satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(graderEngine.build(["0812345678"]))).not.toThrow();
  });
  it("is deterministic: same input -> same output", () => {
    const a = graderEngine.build(["4682"]);
    const b = graderEngine.build(["4682"]);
    expect(a).toEqual(b);
  });
  it("too-short input returns a single note (no throw)", () => {
    const out = graderEngine.build(["7"]);
    expect(out).toEqual([{ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" }]);
  });
  it("reference vector: 4682 has a verdict with numeric score 22..98", () => {
    const out = graderEngine.build(["4682"]);
    const verdict = out.find((s) => s.kind === "verdict");
    expect(verdict).toBeDefined();
    if (verdict && verdict.kind === "verdict") {
      expect(verdict.score).toBeGreaterThanOrEqual(22);
      expect(verdict.score).toBeLessThanOrEqual(98);
      expect(verdict.grade).toBeTruthy();
    }
  });
  it("result is complete (not thin): verdict + rows + grid + prose + note all present", () => {
    const out = graderEngine.build(["0812345678"]);
    const kinds = out.map((s) => s.kind);
    expect(kinds).toContain("verdict");
    expect(kinds).toContain("rows");
    expect(kinds).toContain("grid");
    expect(kinds).toContain("prose");
    expect(kinds).toContain("note");
  });
  it("passes a sensible label+glyph into the report (verdict summary starts with the label)", () => {
    const out = graderEngine.build(["1424"]);
    const verdict = out.find((s) => s.kind === "verdict");
    expect(verdict && verdict.kind === "verdict" && verdict.summary.startsWith("เลข")).toBe(true);
    const rows = out.find((s) => s.kind === "rows");
    expect(rows && rows.kind === "rows" && rows.glyph).toBe("數");
  });
  it("never returns an empty rows section: at least one analysis row always shown", () => {
    // a digit string with no table pairs (e.g. 11 not in PAIRS) still yields a placeholder row
    const out = graderEngine.build(["11"]);
    const rows = out.find((s) => s.kind === "rows");
    expect(rows && rows.kind === "rows" && rows.items.length).toBeGreaterThanOrEqual(1);
  });
});
