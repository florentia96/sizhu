import { describe, it, expect } from "vitest";
import { def } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("natal registry", () => {
  it("def is registered under astro group with date/time/city fields", () => {
    expect(def.group).toBe("astro");
    expect(def.meta.id).toBe("natal");
    expect(def.fields.map((x) => x.type)).toEqual(["date", "time", "city"]);
    expect(def.fullRoute).not.toBe(true);
  });
  it("auto-discovered by the glob registry", () => {
    const f = FEATURES.natal;
    expect(f).toBeTruthy();
    expect(f.group).toBe("astro");
  });
  it("engine wired and produces schema-valid output", () => {
    const r = def.engine.build(["1990-01-15", "14:30", "กรุงเทพมหานคร"]);
    expect(() => ReportSchema.parse(r)).not.toThrow();
  });
});
