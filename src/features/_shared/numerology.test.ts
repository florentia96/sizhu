import { describe, it, expect } from "vitest";
import { analyzeNumber } from "./numerology";

describe("analyzeNumber", () => {
  it("flags the 14 good pair", () => {
    const a = analyzeNumber("14");
    expect(a.digits).toBe("14");
    expect(a.pairs).toHaveLength(1);
    expect(a.pairs[0].n).toBe("14");
    expect(a.pairs[0].title).toBe("เมตตามหานิยม");
    expect(a.pairs[0].tone).toBe("good");
    expect(a.pairs[0].fg).toBe("#6cc18a");
    expect(a.good).toBe(1);
    expect(a.bad).toBe(0);
    expect(a.warn).toBe(0);
  });

  it("scores '14' at the B boundary (62 + 1 good*6, neutral sum)", () => {
    const a = analyzeNumber("14");
    expect(a.total).toBe(5);
    expect(a.sumQual).toBe("neutral");
    expect(a.score).toBe(68);
  });

  it("strips non-digits before analysis", () => {
    expect(analyzeNumber("08-1234").digits).toBe("081234");
  });

  it("counts overlapping (sliding-window) pairs, not disjoint", () => {
    // '141' -> '14' (good) and '41' (good) = 2 overlapping pairs
    const a = analyzeNumber("141");
    expect(a.pairs.map((p) => p.n)).toEqual(["14", "41"]);
    expect(a.good).toBe(2);
  });

  it("is deterministic — same input, same output", () => {
    expect(analyzeNumber("0812345678")).toEqual(analyzeNumber("0812345678"));
  });
});
