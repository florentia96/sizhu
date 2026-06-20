import { describe, it, expect } from "vitest";
import { lifeMeta, lifeFields } from "./meta";
import {
  PY_THEME,
  PY_ACTION,
  LIFEPATH,
  TRANSIT_NOTE,
  SCOPE_OPTIONS,
  PLANET_ROLE,
  SCOPE_GUIDE,
  BENEFIC,
  MALEFIC,
} from "./content";

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
  it("scope + as-of date fields carry hints", () => {
    expect((lifeFields[3].hint ?? "").length).toBeGreaterThan(0);
    expect((lifeFields[4].hint ?? "").length).toBeGreaterThan(0);
  });
  it("meta does not claim auto-injection of today (the form does not inject it)", () => {
    expect(lifeMeta.long).not.toMatch(/ฉีดวันนี้|อัตโนมัติ ปรับได้/);
  });
  it("core birth-data field labels are unchanged (resolver matches by label)", () => {
    expect(lifeFields[0].label).toBe("วันเกิด");
    expect(lifeFields[1].label).toBe("เวลาเกิด");
    expect(lifeFields[2].label).toBe("เมืองเกิด");
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
  it("PY_ACTION has do/avoid guidance for personal years 1..9", () => {
    for (let i = 1; i <= 9; i++) {
      expect(PY_ACTION[i].do.length).toBeGreaterThan(0);
      expect(PY_ACTION[i].avoid.length).toBeGreaterThan(0);
    }
  });
  it("PLANET_ROLE covers all 7 transiting bodies", () => {
    for (const p of ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"])
      expect(PLANET_ROLE[p].length).toBeGreaterThan(0);
  });
  it("SCOPE_GUIDE covers every scope option with a lead + 3 tips", () => {
    for (const s of SCOPE_OPTIONS) {
      expect(SCOPE_GUIDE[s].lead.length).toBeGreaterThan(0);
      expect(SCOPE_GUIDE[s].tips.length).toBeGreaterThanOrEqual(3);
    }
  });
  it("benefic/malefic split is disjoint and covers the 7 bodies", () => {
    expect(BENEFIC.some((p) => MALEFIC.includes(p))).toBe(false);
    expect(new Set([...BENEFIC, ...MALEFIC]).size).toBe(7);
  });
});
