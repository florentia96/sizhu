import { describe, it, expect } from "vitest";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("chinese features auto-discovered via glob registry", () => {
  it("all three register under chinese", () => {
    for (const id of ["zodiacyear", "kua", "zodiaccompat"]) {
      expect(FEATURES[id]?.group).toBe("chinese");
    }
  });
  it("discovered engines yield schema-valid reports", () => {
    expect(ReportSchema.parse(FEATURES["zodiacyear"].engine.build(["2535"]))).toBeTruthy();
    expect(ReportSchema.parse(FEATURES["kua"].engine.build(["2535", "ชาย"]))).toBeTruthy();
    expect(ReportSchema.parse(FEATURES["zodiaccompat"].engine.build(["ชวด", "ฉลู"]))).toBeTruthy();
  });
});
