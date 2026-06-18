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
});
