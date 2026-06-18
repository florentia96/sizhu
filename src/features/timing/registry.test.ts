import { describe, it, expect } from "vitest";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("registry — timing wired", () => {
  it("timing อยู่ใน registry หมวด astro", () => {
    const def = FEATURES["timing"];
    expect(def).toBeTruthy();
    expect(def.group).toBe("astro");
    expect(def.meta.id).toBe("timing");
    expect(def.fields).toHaveLength(2);
    expect(def.fields[1].type).toBe("month");
  });

  it("engine ใน registry คืน Section ที่ valid", () => {
    const out = FEATURES["timing"].engine.build(["แต่งงาน", "2025-05"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
});
