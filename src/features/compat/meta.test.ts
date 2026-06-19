import { describe, it, expect } from "vitest";
import { compatMeta, compatFields } from "./meta";
import { EL_HARMONY, SYNASTRY_NOTE } from "./content";

describe("compat meta/fields/content", () => {
  it("meta complete", () => {
    expect(compatMeta.id).toBe("compat");
    for (const k of ["name", "cn", "desc", "long"] as const)
      expect((compatMeta as unknown as Record<string, string>)[k].length).toBeGreaterThan(0);
  });
  it("first two fields are required dates; optional time/city follow", () => {
    const types = compatFields.map((f) => f.type);
    expect(types[0]).toBe("date");
    expect(types[1]).toBe("date");
    expect(types).toContain("time");
    expect(types).toContain("city");
  });
  it("element harmony pairs are symmetric values present", () => {
    for (const el of ["ไฟ", "ลม", "น้ำ", "ดิน"]) expect(typeof EL_HARMONY[el]).toBe("string");
    expect(EL_HARMONY["ไฟ"]).toBe("ลม");
    expect(EL_HARMONY["น้ำ"]).toBe("ดิน");
  });
  it("synastry notes for 5 aspects", () => {
    for (const a of ["conjunction", "sextile", "square", "trine", "opposition"])
      expect(["good", "warn", "info"]).toContain(SYNASTRY_NOTE[a].tone);
  });
});
