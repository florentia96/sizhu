import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { nameSum } from "./numerology";
import { NAME_POOL } from "./content";
import { namesuggestEngine } from "./engine";

describe("namesuggest deepen — numerology + expanded pool", () => {
  it("nameSum ธนกฤต = 14 → 5", () => {
    expect(nameSum("ธนกฤต")).toEqual({ sum: 14, reduced: 5 });
  });

  it("nameSum ณภัทร = 15 → 6", () => {
    expect(nameSum("ณภัทร")).toEqual({ sum: 15, reduced: 6 });
  });

  it("pools are expanded and have no duplicates", () => {
    expect(NAME_POOL["หญิง"].length).toBeGreaterThanOrEqual(30);
    expect(NAME_POOL["ชาย"].length).toBeGreaterThanOrEqual(30);
    expect(NAME_POOL["ไม่ระบุ"].length).toBeGreaterThanOrEqual(20);
    for (const g of ["หญิง", "ชาย", "ไม่ระบุ"]) {
      expect(new Set(NAME_POOL[g]).size).toBe(NAME_POOL[g].length);
    }
  });

  it("each suggested card note carries the numerology reduced digit", () => {
    const out = namesuggestEngine.build(["1990-01-07", "หญิง", ""]);
    const cards = out.find((s) => s.kind === "cards") as Extract<typeof out[number], { kind: "cards" }>;
    expect(cards.items.length).toBeGreaterThan(0);
    for (const item of cards.items) {
      const expected = nameSum(item.value).reduced;
      expect(item.note).toContain("เลข " + expected);
    }
  });

  it("still satisfies ReportSchema and stays deterministic", () => {
    const a = namesuggestEngine.build(["2000-05-15", "ชาย", ""]);
    const b = namesuggestEngine.build(["2000-05-15", "ชาย", ""]);
    expect(a).toEqual(b);
    expect(() => ReportSchema.parse(a)).not.toThrow();
  });
});
