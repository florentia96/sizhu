import { describe, it, expect } from "vitest";
import { rasiReport } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("rasi engine", () => {
  const ref = () => rasiReport(1990, 5, 15);

  it("reference vector: 1990-05-15 => ราศีพฤษภ ธาตุดิน เจ้าเรือนศุกร์", () => {
    const secs = ref();
    const head = secs.find((s) => s.kind === "prose");
    expect(head && head.kind === "prose" && head.title).toBe("ราศีพฤษภ (Taurus)");
    const grid = secs.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      expect(grid.cells.find((c) => c.name === "ราศี")?.value).toBe("ราศีพฤษภ");
      expect(grid.cells.find((c) => c.name === "ธาตุประจำราศี")?.value).toBe("ดิน");
      expect(grid.cells.find((c) => c.name === "ดาวเจ้าเรือน")?.value).toBe("ศุกร์");
    } else {
      throw new Error("grid missing");
    }
  });

  it("blocks list same-element, complementary, and clashing-element signs", () => {
    const blocks = ref().find((s) => s.kind === "blocks");
    if (!blocks || blocks.kind !== "blocks") throw new Error("blocks missing");
    expect(blocks.items.length).toBe(3);
    // for ราศีพฤษภ (ดิน): same=ดิน, compat=น้ำ, clash=ลม
    expect(blocks.items[0].tag).toBe("ธาตุดิน");
    expect(blocks.items[1].tag).toBe("ธาตุน้ำ");
    expect(blocks.items[2].tag).toBe("ธาตุลม");
    // same-element chips exclude the sign itself; complementary lists all 3 of its element
    expect(blocks.items[0].chips).not.toContain("ราศีพฤษภ");
    expect(blocks.items[0].chips.length).toBe(2);
    expect(blocks.items[1].chips.length).toBe(3);
    expect(blocks.items[2].chips.length).toBe(3);
    // every chip is a real "ราศี…" label, no placeholder dash
    blocks.items.forEach((it) =>
      it.chips.forEach((c) => {
        expect(c.startsWith("ราศี")).toBe(true);
        expect(c).not.toBe("—");
      }),
    );
  });

  it("includes a per-element guidance prose section (strength/watch/advice)", () => {
    const secs = ref();
    const guide = secs.find(
      (s) => s.kind === "prose" && s.title === "จุดเด่น จุดที่ควรระวัง และแนวทาง",
    );
    if (!guide || guide.kind !== "prose") throw new Error("guidance section missing");
    expect(guide.paras.map((p) => p.h)).toEqual([
      "จุดเด่น",
      "จุดที่ควรระวัง",
      "แนวทางพัฒนาตัวเอง",
    ]);
    guide.paras.forEach((p) => expect(p.t.length).toBeGreaterThan(0));
  });

  it("result is rich: prose head + grid + love/career + guidance + blocks present", () => {
    const secs = ref();
    expect(secs.filter((s) => s.kind === "prose").length).toBeGreaterThanOrEqual(3);
    expect(secs.some((s) => s.kind === "grid")).toBe(true);
    expect(secs.some((s) => s.kind === "blocks")).toBe(true);
    // no empty text anywhere
    secs.forEach((s) => {
      if (s.kind === "prose") s.paras.forEach((p) => expect(p.t.length).toBeGreaterThan(0));
      if (s.kind === "note") expect(s.text.length).toBeGreaterThan(0);
    });
  });

  it("fire reference vector: 1990-04-20 => ราศีเมษ ธาตุไฟ เจ้าเรือนอังคาร", () => {
    const secs = rasiReport(1990, 4, 20);
    const grid = secs.find((s) => s.kind === "grid");
    if (!grid || grid.kind !== "grid") throw new Error("grid missing");
    expect(grid.cells.find((c) => c.name === "ราศี")?.value).toBe("ราศีเมษ");
    expect(grid.cells.find((c) => c.name === "ธาตุประจำราศี")?.value).toBe("ไฟ");
    expect(grid.cells.find((c) => c.name === "ดาวเจ้าเรือน")?.value).toBe("อังคาร");
  });

  it("tone: no ครับ/ค่ะ politeness particles or em-dash list stacking in note text", () => {
    const secs = ref();
    secs.forEach((s) => {
      if (s.kind === "note") {
        expect(s.text).not.toMatch(/ครับ|ค่ะ|นะคะ/);
      }
    });
  });

  it("is deterministic", () => {
    expect(JSON.stringify(ref())).toBe(JSON.stringify(ref()));
  });

  it("satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(ref())).not.toThrow();
  });

  it("normalizes Buddhist year", () => {
    expect(JSON.stringify(rasiReport(2533, 5, 15))).toBe(JSON.stringify(ref()));
  });

  it("invalid input returns schema-valid note", () => {
    const out = rasiReport(NaN, NaN, NaN);
    expect(out[0].kind).toBe("note");
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
});
