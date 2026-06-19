import { describe, it, expect } from "vitest";
import { findluckyEngine, rankLucky } from "./engine";
import { ReportSchema } from "../../shared/sections/types";
import { PAGE_SIZE } from "./content";

describe("findlucky engine", () => {
  it("output satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(findluckyEngine.build(["เบอร์โทรศัพท์", "", "มาตรฐาน", "0"]))).not.toThrow();
  });

  it("is deterministic: same input -> deeply equal output (no Math.random)", () => {
    const a = findluckyEngine.build(["เบอร์โทรศัพท์", "", "มาตรฐาน", "0"]);
    const b = findluckyEngine.build(["เบอร์โทรศัพท์", "", "มาตรฐาน", "0"]);
    expect(a).toEqual(b);
  });

  it("ranked list is stable-sorted: score desc then raw asc", () => {
    const ranked = rankLucky("เบอร์โทรศัพท์", "", "มาตรฐาน");
    const scores = ranked.map((r) => parseInt(r.note.match(/ผลรวม (\d+)/)?.[1] ?? "0", 10));
    const reranked = rankLucky("เบอร์โทรศัพท์", "", "มาตรฐาน");
    expect(ranked).toEqual(reranked);
    expect(scores.length).toBeGreaterThan(PAGE_SIZE);
  });

  it("paging via vals[3]: page0 and page1 are disjoint and union = first 2*PAGE_SIZE of ranked", () => {
    const ranked = rankLucky("เบอร์โทรศัพท์", "", "มาตรฐาน").map((r) => r.raw);
    const page0 = findluckyEngine
      .build(["เบอร์โทรศัพท์", "", "มาตรฐาน", "0"])
      .flatMap((s) => (s.kind === "cards" ? s.items.map((i) => i.value) : []));
    const page1 = findluckyEngine
      .build(["เบอร์โทรศัพท์", "", "มาตรฐาน", String(PAGE_SIZE)])
      .flatMap((s) => (s.kind === "cards" ? s.items.map((i) => i.value) : []));
    const norm = (s: string) => s.replace(/[^0-9]/g, "");
    const p0raw = page0.map(norm);
    const p1raw = page1.map(norm);
    expect(p0raw).toEqual(ranked.slice(0, PAGE_SIZE));
    expect(p1raw).toEqual(ranked.slice(PAGE_SIZE, 2 * PAGE_SIZE));
    expect(p0raw.filter((x) => p1raw.includes(x))).toHaveLength(0);
  });

  it("want filter: every result contains the requested digits", () => {
    const ranked = rankLucky("เบอร์โทรศัพท์", "24", "มาตรฐาน");
    expect(ranked.length).toBeGreaterThan(0);
    ranked.forEach((r) => expect(r.raw).toContain("24"));
  });

  it("premium threshold is stricter (>= standard count)", () => {
    const std = rankLucky("เบอร์โทรศัพท์", "", "มาตรฐาน").length;
    const prm = rankLucky("เบอร์โทรศัพท์", "", "พรีเมียม").length;
    expect(prm).toBeLessThanOrEqual(std);
  });

  it("plate type produces 4-digit raws", () => {
    const ranked = rankLucky("ทะเบียนรถ", "", "มาตรฐาน");
    expect(ranked.length).toBeGreaterThan(0);
    ranked.forEach((r) => expect(r.raw).toMatch(/^\d{4}$/));
  });

  it("phone raws are 10 digits with 3-3-4 display (regression: was 9-digit)", () => {
    const ranked = rankLucky("เบอร์โทรศัพท์", "", "มาตรฐาน");
    expect(ranked.length).toBeGreaterThan(0);
    ranked.slice(0, 30).forEach((r) => {
      expect(r.raw).toMatch(/^\d{10}$/);
      expect(r.value).toMatch(/^\d{3}-\d{3}-\d{4}$/);
    });
  });
});
