import { describe, it, expect } from "vitest";
import { def } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("ascendant registry", () => {
  it("def registered under astro with date/time/city", () => {
    expect(def.group).toBe("astro");
    expect(def.meta.id).toBe("ascendant");
    expect(def.fields.map((x) => x.type)).toEqual(["date", "time", "city"]);
  });
  it("auto-discovered by the glob registry", () => {
    expect(FEATURES.ascendant).toBeTruthy();
    expect(FEATURES.ascendant.group).toBe("astro");
  });
  it("engine produces schema-valid output", () => {
    const r = def.engine.build(["1990-01-15", "14:30", "กรุงเทพมหานคร"]);
    expect(() => ReportSchema.parse(r)).not.toThrow();
  });
});
