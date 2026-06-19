import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { kalakiniEngine } from "./engine";
import { kalakiniFields } from "./fields";
import { kalakiniMeta } from "./meta";

describe("kalakini engine", () => {
  it("meta + fields shape", () => {
    expect(kalakiniMeta.id).toBe("kalakini");
    expect(kalakiniFields).toHaveLength(1);
    expect(kalakiniFields[0]).toMatchObject({ type: "select" });
    const opts = (kalakiniFields[0] as { options: string[] }).options;
    expect(opts).toHaveLength(8);
    expect(opts).toContain("พุธ (กลางคืน)");
  });

  it("satisfies ReportSchema for every weekday option", () => {
    const opts = (kalakiniFields[0] as { options: string[] }).options;
    for (const day of opts) {
      const out = kalakiniEngine.build([day]);
      expect(() => ReportSchema.parse(out)).not.toThrow();
    }
  });

  it("is deterministic", () => {
    const a = kalakiniEngine.build(["อาทิตย์"]);
    const b = kalakiniEngine.build(["อาทิตย์"]);
    expect(a).toEqual(b);
  });

  it("reference vector: Sunday-born กาลกิณี group = ศุกร์ letters ศ ษ ส ห ฬ ฮ", () => {
    const out = kalakiniEngine.build(["อาทิตย์"]);
    const blocks = out.find((s) => s.kind === "blocks") as Extract<typeof out[number], { kind: "blocks" }>;
    const kala = blocks.items[0];
    expect(kala.tag).toBe("หลีกเลี่ยง");
    expect(kala.accent).toBe("#e0584b");
    expect(kala.chips).toEqual(["ศ", "ษ", "ส", "ห", "ฬ", "ฮ"]);
  });

  it("emits a full 8-ภูมิ grid", () => {
    const out = kalakiniEngine.build(["จันทร์"]);
    const grid = out.find((s) => s.kind === "grid") as Extract<typeof out[number], { kind: "grid" }>;
    expect(grid.title).toBe("ครบทั้ง 8 ภูมิทักษา");
    expect(grid.cells).toHaveLength(8);
  });

  it("empty/unknown input falls back without throwing", () => {
    const out = kalakiniEngine.build([""]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
});
