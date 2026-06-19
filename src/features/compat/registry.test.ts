import { describe, it, expect } from "vitest";
import { def } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("compat registry", () => {
  it("def registered under astro; first two fields are dates", () => {
    expect(def.group).toBe("astro");
    expect(def.meta.id).toBe("compat");
    expect(def.fields[0].type).toBe("date");
    expect(def.fields[1].type).toBe("date");
  });
  it("auto-discovered by the glob registry", () => {
    expect(FEATURES.compat).toBeTruthy();
    expect(FEATURES.compat.group).toBe("astro");
  });
  it("engine schema-valid for dates-only and for full data", () => {
    const datesOnly = def.engine.build(["1990-01-15", "1992-07-20"]);
    expect(() => ReportSchema.parse(datesOnly)).not.toThrow();
    const full = def.engine.build([
      "1990-01-15", "1992-07-20", "14:30", "กรุงเทพมหานคร", "08:15", "เชียงใหม่",
    ]);
    expect(() => ReportSchema.parse(full)).not.toThrow();
    expect(full.some((s) => s.kind === "blocks")).toBe(true);
  });
});
