import { describe, it, expect } from "vitest";
import { dreamReport } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("dream engine", () => {
  it("matches งู and emits its numbers as cards", () => {
    const secs = dreamReport("เมื่อคืนฝันเห็นงูตัวใหญ่");
    const prose = secs.find((s) => s.kind === "prose");
    expect(prose && prose.kind === "prose" && prose.paras.some((p) => p.h?.includes("งู"))).toBe(true);
    const cards = secs.find((s) => s.kind === "cards");
    if (cards && cards.kind === "cards") {
      const values = cards.items.map((i) => i.value);
      expect(values).toContain("56");
      expect(values).toContain("569");
    } else {
      throw new Error("cards missing");
    }
  });

  it("orders cards 2-digit, then 3-digit, then 1-digit", () => {
    const cards = dreamReport("งู").find((s) => s.kind === "cards");
    if (cards && cards.kind === "cards") {
      const badges = cards.items.map((i) => i.badge);
      const firstThree = badges.indexOf("3 ตัว");
      const firstOne = badges.indexOf("วิ่ง");
      const lastTwo = badges.lastIndexOf("2 ตัว");
      expect(lastTwo).toBeLessThan(firstThree);
      expect(firstThree).toBeLessThan(firstOne);
    } else {
      throw new Error("cards missing");
    }
  });

  it("dedups numbers across multiple keyword hits", () => {
    const cards = dreamReport("ฝันเห็นน้ำและฝน").find((s) => s.kind === "cards");
    if (cards && cards.kind === "cards") {
      const values = cards.items.map((i) => i.value);
      expect(new Set(values).size).toBe(values.length);
    } else {
      throw new Error("cards missing");
    }
  });

  it("no keyword => helpful prose + disclaimer note, never throws", () => {
    const secs = dreamReport("aksjdhfkjh");
    expect(secs.find((s) => s.kind === "prose")).toBeDefined();
    expect(secs[secs.length - 1].kind).toBe("note");
    expect(() => ReportSchema.parse(secs)).not.toThrow();
  });

  it("empty input => schema-valid output with disclaimer", () => {
    const secs = dreamReport("");
    expect(secs[secs.length - 1].kind).toBe("note");
    expect(() => ReportSchema.parse(secs)).not.toThrow();
  });

  it("is deterministic + satisfies ReportSchema", () => {
    const a = dreamReport("ฝันเห็นช้างและทอง");
    const b = dreamReport("ฝันเห็นช้างและทอง");
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(() => ReportSchema.parse(a)).not.toThrow();
  });
});
