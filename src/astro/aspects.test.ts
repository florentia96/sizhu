import { describe, it, expect } from "vitest";
import { aspectsBetween } from "./aspects";

describe("F4.6 aspectsBetween — detection & orb", () => {
  it("detects an exact conjunction (orb 0)", () => {
    const r = aspectsBetween({ Sun: 100 }, { Mars: 100 });
    expect(r).toEqual([{ a: "Sun", b: "Mars", type: "conjunction", orb: 0 }]);
  });

  it("detects a trine within orb and reports the orb", () => {
    const r = aspectsBetween({ Sun: 10 }, { Jupiter: 133 }); // 123° apart, trine=120, orb 3
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("trine");
    expect(r[0].orb).toBeCloseTo(3, 6);
  });

  it("detects opposition across the 0/360 wrap", () => {
    const r = aspectsBetween({ Moon: 350 }, { Saturn: 170 }); // 180° apart
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("opposition");
    expect(r[0].orb).toBeCloseTo(0, 6);
  });

  it("detects sextile and square", () => {
    expect(aspectsBetween({ A: 0 }, { B: 60 })[0].type).toBe("sextile");
    expect(aspectsBetween({ A: 0 }, { B: 90 })[0].type).toBe("square");
  });

  it("ignores separations outside the default ±6° orb", () => {
    const r = aspectsBetween({ Sun: 0 }, { Pluto: 50 }); // 50° from any aspect
    expect(r).toEqual([]);
  });

  it("respects a custom orb", () => {
    const tight = aspectsBetween({ Sun: 0 }, { Mars: 8 }, 3); // 8° from conjunction
    expect(tight).toEqual([]);
    const wide = aspectsBetween({ Sun: 0 }, { Mars: 8 }, 10);
    expect(wide[0].type).toBe("conjunction");
    expect(wide[0].orb).toBeCloseTo(8, 6);
  });

  it("computes all cross pairs and is deterministic", () => {
    const a = { Sun: 0, Moon: 90 };
    const b = { Mars: 0, Venus: 180 };
    const r1 = aspectsBetween(a, b);
    const r2 = aspectsBetween(a, b);
    expect(r1).toEqual(r2);
    // Sun-Mars conj, Sun-Venus opp, Moon-Mars square, Moon-Venus square
    expect(r1.length).toBe(4);
  });
});
