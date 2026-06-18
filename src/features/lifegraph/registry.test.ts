import { describe, it, expect } from "vitest";
import { def } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("lifegraph registry", () => {
  it("def registered under astro with 5 fields ending in date(now)", () => {
    expect(def.group).toBe("astro");
    expect(def.meta.id).toBe("lifegraph");
    expect(def.fields.map((x) => x.type)).toEqual(["date", "time", "city", "select", "date"]);
  });
  it("auto-discovered by the glob registry", () => {
    expect(FEATURES.lifegraph).toBeTruthy();
    expect(FEATURES.lifegraph.group).toBe("astro");
  });
  it("engine deterministic with injected now & schema-valid", () => {
    const v = ["1990-01-15", "14:30", "กรุงเทพมหานคร", "ภาพรวมปีนี้", "2026-06-19"];
    const r = def.engine.build(v);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(def.engine.build(v)).toEqual(r);
  });
});
