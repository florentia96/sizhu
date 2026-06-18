import { describe, it, expect } from "vitest";
import { ascEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

const VALS = ["1990-01-15", "14:30", "กรุงเทพมหานคร"];

describe("ascendant engine", () => {
  it("schema-valid + deterministic", () => {
    const r = ascEngine.build(VALS);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(ascEngine.build(VALS)).toEqual(ascEngine.build(VALS));
  });

  it("grid has Asc, Sun rasi, Moon rasi, Thai lagna", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    expect(grid).toBeTruthy();
    if (grid && grid.kind === "grid") {
      const names = grid.cells.map((c) => c.name).join("|");
      expect(names).toContain("ลัคนา");
      expect(names).toContain("ราศีอาทิตย์");
      expect(names).toContain("ราศีจันทร์");
      expect(names).toContain("ลัคนาโหราไทย");
    }
  });

  it("reference vector: Sun sign = มังกร (Capricorn) for 1990-01-15", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const sun = grid.cells.find((c) => c.name.includes("ราศีอาทิตย์"));
      expect(sun?.value).toContain("มังกร");
    }
  });

  it("reference vector: tropical Asc differs from Thai sidereal lagna", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const trop = grid.cells.find((c) => c.name.includes("ลัคนา") && !c.name.includes("ไทย"));
      const thai = grid.cells.find((c) => c.name.includes("ลัคนาโหราไทย"));
      expect(trop?.value).toBeTruthy();
      expect(thai?.value).toBeTruthy();
      expect(trop?.value).not.toEqual(thai?.value);
    }
  });

  it("invalid input → note", () => {
    expect(ascEngine.build([""])).toEqual([
      { kind: "note", text: "กรอกวันเกิด เวลาเกิด และเมืองเกิด ให้ครบ แล้วลองใหม่" },
    ]);
  });
});
