import { describe, it, expect } from "vitest";
import { compatEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

const FULL = [
  "1990-01-15",
  "1992-07-20",
  "14:30",
  "กรุงเทพมหานคร",
  "08:15",
  "เชียงใหม่",
];

describe("compat synastry layer", () => {
  it("adds a synastry blocks section when both parties have time+city", () => {
    const r = compatEngine.build(FULL);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    const synastry = r.find((s) => s.kind === "blocks");
    expect(synastry).toBeTruthy();
    if (synastry && synastry.kind === "blocks") {
      expect(synastry.title).toContain("สมพงษ์");
      expect(synastry.items.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("deterministic with full data", () => {
    expect(compatEngine.build(FULL)).toEqual(compatEngine.build(FULL));
  });

  it("still no synastry block when one party's city is missing", () => {
    const partial = ["1990-01-15", "1992-07-20", "14:30", "กรุงเทพมหานคร", "08:15", ""];
    const r = compatEngine.build(partial);
    expect(r.filter((s) => s.kind === "blocks").length).toBe(0);
  });

  it("compat score section still first even with full data", () => {
    expect(compatEngine.build(FULL)[0].kind).toBe("compat");
  });
});
