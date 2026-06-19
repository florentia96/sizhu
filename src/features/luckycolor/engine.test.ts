import { describe, it, expect } from "vitest";
import { luckyColorReport } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("luckycolor engine", () => {
  const ref = () => luckyColorReport("จันทร์", "การเงิน");

  it("reference vector: จันทร์ + การเงิน => money colors เขียว", () => {
    const secs = ref();
    const sw = secs.filter((s) => s.kind === "swatches");
    expect(sw.length).toBe(3); // base / aspect / avoid
    const aspect = sw[1];
    if (aspect.kind === "swatches") {
      expect(aspect.items.map((i) => i.name)).toContain("เขียว");
      expect(aspect.items.every((i) => /^#/.test(i.hex))).toBe(true);
    } else {
      throw new Error("aspect swatches missing");
    }
  });

  it("grid breaks down all 4 aspects", () => {
    const grid = ref().find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      expect(grid.cells.map((c) => c.name)).toEqual([
        "การงาน", "การเงิน", "ความรัก", "เมตตามหานิยม",
      ]);
    } else {
      throw new Error("grid missing");
    }
  });

  it("unknown aspect falls back to luck colors", () => {
    const fallback = luckyColorReport("จันทร์", "ไม่มีด้านนี้");
    const luck = luckyColorReport("จันทร์", "เมตตามหานิยม");
    const fa = fallback.filter((s) => s.kind === "swatches")[1];
    const lu = luck.filter((s) => s.kind === "swatches")[1];
    if (fa.kind === "swatches" && lu.kind === "swatches") {
      expect(fa.items.map((i) => i.name)).toEqual(lu.items.map((i) => i.name));
    } else {
      throw new Error("swatches missing");
    }
  });

  it("unknown day returns a note, not a silent อาทิตย์ fallback (regression)", () => {
    const unknown = luckyColorReport("ไม่ใช่วัน", "การงาน");
    expect(unknown.length).toBe(1);
    expect(unknown[0].kind).toBe("note");
  });

  it("is deterministic + satisfies ReportSchema", () => {
    expect(JSON.stringify(ref())).toBe(JSON.stringify(ref()));
    expect(() => ReportSchema.parse(ref())).not.toThrow();
  });
});
