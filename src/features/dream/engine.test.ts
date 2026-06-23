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

  it("expanded dictionary covers common new symbols (มังกร, อุจจาระ)", () => {
    expect(dreamReport("ฝันเห็นมังกร").find((s) => s.kind === "cards")).toBeDefined();
    expect(dreamReport("ฝันเห็นอุจจาระ").find((s) => s.kind === "cards")).toBeDefined();
  });

  it("short keywords match whole words only — 'มด' must not match inside 'หมด'", () => {
    const secs = dreamReport("ฝันว่าของหมด");
    expect(secs.find((s) => s.kind === "cards")).toBeUndefined();
    expect(secs[secs.length - 1].kind).toBe("note");
  });

  it("fallback (no Intl.Segmenter): short kw matches whole word only — no false positive", () => {
    const intl = Intl as unknown as { Segmenter?: unknown };
    const orig = intl.Segmenter;
    intl.Segmenter = undefined;
    try {
      // short words typed on their own are still matched
      expect(dreamReport("งู").find((s) => s.kind === "cards")).toBeDefined();
      // the short Thai word for 'ant' must not match inside the word for 'all gone' even without Segmenter
      const secs = dreamReport("ฝันว่าของหมด");
      expect(secs.find((s) => s.kind === "cards")).toBeUndefined();
      expect(secs[secs.length - 1].kind).toBe("note");
    } finally {
      intl.Segmenter = orig;
    }
  });

  it("is deterministic + satisfies ReportSchema", () => {
    const a = dreamReport("ฝันเห็นช้างและทอง");
    const b = dreamReport("ฝันเห็นช้างและทอง");
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(() => ReportSchema.parse(a)).not.toThrow();
  });

  it("คำยาวไม่ถูกคำสั้นชน — 'พระจันทร์' ไม่ดึงสัญลักษณ์/เลขของ 'พระ'", () => {
    const secs = dreamReport("ฝันเห็นพระจันทร์");
    const prose = secs.find((s) => s.kind === "prose");
    if (prose?.kind !== "prose") throw new Error("no prose");
    const heads = prose.paras.map((p) => p.h);
    expect(heads).toContain("พระจันทร์");
    expect(heads).not.toContain("พระ");
    const cards = secs.find((s) => s.kind === "cards");
    if (cards?.kind !== "cards") throw new Error("no cards");
    const values = cards.items.map((i) => i.value);
    expect(values).toContain("28"); // the number for the moon (phra chan)
    expect(values).not.toContain("89"); // the number for 'phra' (monk) must not bleed in
  });

  it("คำยาวไม่ถูกคำสั้นชน — 'ทะเลาะ' ไม่ดึงสัญลักษณ์/เลขของ 'น้ำ'", () => {
    const secs = dreamReport("ฝันว่าทะเลาะกัน");
    const prose = secs.find((s) => s.kind === "prose");
    if (prose?.kind !== "prose") throw new Error("no prose");
    const heads = prose.paras.map((p) => p.h);
    expect(heads).toContain("ทะเลาะ");
    expect(heads).not.toContain("น้ำ");
    const cards = secs.find((s) => s.kind === "cards");
    if (cards?.kind !== "cards") throw new Error("no cards");
    const values = cards.items.map((i) => i.value);
    expect(values).not.toContain("27"); // the number for 'water' must not bleed in
  });
});
