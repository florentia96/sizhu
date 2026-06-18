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

  it("blocks list same-element and complementary-element signs", () => {
    const blocks = ref().find((s) => s.kind === "blocks");
    expect(blocks && blocks.kind === "blocks" && blocks.items.length).toBe(2);
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
