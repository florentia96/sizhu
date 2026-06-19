import { describe, it, expect } from "vitest";
import { lifeMeta, lifeFields } from "./meta";
import { PY_THEME, LIFEPATH, TRANSIT_NOTE, SCOPE_OPTIONS } from "./content";

describe("lifegraph meta/fields/content", () => {
  it("meta complete", () => {
    expect(lifeMeta.id).toBe("lifegraph");
    for (const k of ["name", "cn", "desc", "long"] as const)
      expect((lifeMeta as unknown as Record<string, string>)[k].length).toBeGreaterThan(0);
  });
  it("fields: date,time,city,select,date(now-injection)", () => {
    expect(lifeFields.map((f) => f.type)).toEqual(["date", "time", "city", "select", "date"]);
  });
  it("scope select options match SCOPE_OPTIONS", () => {
    const sel = lifeFields[3];
    if (sel.type === "select") expect(sel.options).toEqual(SCOPE_OPTIONS);
  });
  it("PY themes 1..9 + lifepath 1..9,11,22", () => {
    for (let i = 1; i <= 9; i++) expect(PY_THEME[i].length).toBeGreaterThan(0);
    for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22]) expect(LIFEPATH[i].k.length).toBeGreaterThan(0);
  });
  it("transit notes for 5 aspect types", () => {
    for (const a of ["conjunction", "sextile", "square", "trine", "opposition"]) {
      expect(TRANSIT_NOTE[a].th.length).toBeGreaterThan(0);
      expect(["good", "warn", "info"]).toContain(TRANSIT_NOTE[a].tone);
    }
  });
});
