import { describe, it, expect } from "vitest";
import { engine, compute7 } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("num7 engine", () => {
  // Reference vector: 1987-01-01 = Thursday → seeds day=5, month=1, year=7 (1+9+8+7=25→7)
  it("computes the 7 bases for 1987-01-01 (Thursday)", () => {
    expect(compute7("1987-01-01")).toEqual([
      [5, 6, 7, 1, 2, 3, 4], // ฐานบน  วันพฤหัส=5
      [1, 2, 3, 4, 5, 6, 7], // ฐานกลาง เดือน 1
      [7, 1, 2, 3, 4, 5, 6], // ฐานล่าง ปีรวม 7
      [13, 9, 12, 8, 11, 14, 17], // ฐาน4 column sum (raw)
      [6, 2, 5, 1, 4, 7, 3], // ฐาน5 reduce(ฐาน4)
      [5, 4, 3, 2, 1, 7, 6], // ฐาน6 reduce(ฐาน5×2)
      [3, 1, 6, 4, 2, 7, 5], // ฐาน7 reduce(ฐาน6×2)
    ]);
  });
  it("ฐาน7 differs from ฐาน4 (no doubling-cycle collapse)", () => {
    const g = compute7("1987-01-01")!;
    expect(g[6]).not.toEqual(g[3]);
  });
  it("rows 1-3 and 5-7 stay within 1..7", () => {
    const g = compute7("1990-07-15")!;
    for (const r of [0, 1, 2, 4, 5, 6])
      for (const v of g[r]) {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(7);
      }
  });
  it("is deterministic", () => {
    expect(engine.build(["1987-01-01"])).toEqual(engine.build(["1987-01-01"]));
  });
  it("output passes ReportSchema", () => {
    expect(() => ReportSchema.parse(engine.build(["1987-01-01"]))).not.toThrow();
  });
  it("emits grid + blocks + prose with per-phop meaning", () => {
    const secs = engine.build(["1987-01-01"]);
    const kinds = secs.map((s) => s.kind);
    expect(kinds).toContain("grid");
    expect(kinds).toContain("blocks");
    expect(kinds).toContain("prose");
    const grid = secs.find((s) => s.kind === "grid") as Extract<
      (typeof secs)[number],
      { kind: "grid" }
    >;
    expect(grid.cells).toHaveLength(21); // 3 rows × 7 ภพ
    expect(grid.cells[0].name).toBe("อัตตะ");
  });
  it("bad input → single note (no throw)", () => {
    expect(engine.build([""])).toEqual([{ kind: "note", text: expect.stringContaining("วันเกิด") }]);
    expect(engine.build(["not-a-date"])).toEqual([
      { kind: "note", text: expect.stringContaining("วันเกิด") },
    ]);
  });
});
