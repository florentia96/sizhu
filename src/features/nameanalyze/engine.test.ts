import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { nameanalyzeEngine } from "./engine";
import { nameanalyzeFields } from "./fields";
import { nameanalyzeMeta } from "./meta";

describe("nameanalyze engine — taksa core", () => {
  it("meta + fields shape", () => {
    expect(nameanalyzeMeta.id).toBe("nameanalyze");
    expect(nameanalyzeFields).toHaveLength(3);
    expect(nameanalyzeFields[2]).toMatchObject({ type: "select" });
  });

  it("empty name returns a note (no throw)", () => {
    const out = nameanalyzeEngine.build(["", "", "อาทิตย์"]);
    expect(out).toEqual([{ kind: "note", text: "กรุณากรอกชื่อจริงเพื่อวิเคราะห์" }]);
  });

  it("satisfies ReportSchema", () => {
    const out = nameanalyzeEngine.build(["ธนกฤต", "ใจดี", "อาทิตย์"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });

  it("is deterministic", () => {
    const a = nameanalyzeEngine.build(["สมชาย", "", "อาทิตย์"]);
    const b = nameanalyzeEngine.build(["สมชาย", "", "อาทิตย์"]);
    expect(a).toEqual(b);
  });

  it("reference vector: Sunday-born name with ส flags กาลกิณี (ศุกร์ group)", () => {
    // Sunday กาลกิณี = ศุกร์ group [ศ ษ ส ห ฬ ฮ]; 'สม' contains ส (kala) and ม (good, มนตรี/บริวาร group)
    const out = nameanalyzeEngine.build(["สม", "", "อาทิตย์"]);
    const verdict = out.find((s) => s.kind === "verdict") as Extract<typeof out[number], { kind: "verdict" }>;
    expect(verdict.gradeLabel).toBe("มีอักษรกาลกิณี");
    expect(verdict.accent).toBe("#e0584b");
    const blocks = out.filter((s) => s.kind === "blocks") as Extract<typeof out[number], { kind: "blocks" }>[];
    const kalaBlock = blocks.find((b) => b.items[0].tag === "กาลกิณี");
    expect(kalaBlock).toBeDefined();
    expect(kalaBlock!.items[0].chips).toContain("ส");
  });

  it("reference vector: clean name for Sunday has no กาลกิณี block + score capped 25..96", () => {
    // 'กก' = จันทร์ group, never กาลกิณี for Sunday
    const out = nameanalyzeEngine.build(["กก", "", "อาทิตย์"]);
    const verdict = out.find((s) => s.kind === "verdict") as Extract<typeof out[number], { kind: "verdict" }>;
    expect(verdict.score).toBeGreaterThanOrEqual(25);
    expect(verdict.score).toBeLessThanOrEqual(96);
    expect(verdict.gradeLabel).not.toBe("มีอักษรกาลกิณี");
  });
});
