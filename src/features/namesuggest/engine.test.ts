import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { namesuggestEngine } from "./engine";
import { namesuggestFields } from "./fields";
import { namesuggestMeta } from "./meta";
import { taksaForDay } from "../../features/_shared/taksa";
import { dayFromDate } from "../../features/_shared/thaiAstro";

describe("namesuggest engine — pool filter", () => {
  it("meta + fields shape", () => {
    expect(namesuggestMeta.id).toBe("namesuggest");
    expect(namesuggestFields).toHaveLength(3);
    expect(namesuggestFields[0]).toMatchObject({ type: "date" });
    expect(namesuggestFields[1]).toMatchObject({ type: "select" });
  });

  it("satisfies ReportSchema", () => {
    const out = namesuggestEngine.build(["1990-01-07", "หญิง", ""]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });

  it("is deterministic", () => {
    const a = namesuggestEngine.build(["1990-01-07", "ชาย", ""]);
    const b = namesuggestEngine.build(["1990-01-07", "ชาย", ""]);
    expect(a).toEqual(b);
  });

  it("every suggested name is kalakini-free for that birth weekday", () => {
    const dateStr = "2000-05-15";
    const [y, m, d] = dateStr.split("-").map(Number);
    const day = dayFromDate(y, m, d);
    const kala = new Set(taksaForDay(day)[7].letters);
    for (const gender of ["หญิง", "ชาย", "ไม่ระบุ"]) {
      const out = namesuggestEngine.build([dateStr, gender, ""]);
      const cards = out.find((s) => s.kind === "cards") as Extract<typeof out[number], { kind: "cards" }>;
      for (const item of cards.items) {
        for (const ch of item.value) {
          expect(kala.has(ch)).toBe(false);
        }
      }
    }
  });

  it("prefix filter keeps only names starting with the prefix", () => {
    const out = namesuggestEngine.build(["1990-01-07", "ชาย", "ธ"]);
    const cards = out.find((s) => s.kind === "cards") as Extract<typeof out[number], { kind: "cards" }>;
    for (const item of cards.items) {
      expect(item.value.startsWith("ธ")).toBe(true);
    }
  });

  it("missing date still returns names (no throw)", () => {
    const out = namesuggestEngine.build(["", "หญิง", ""]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
    const cards = out.find((s) => s.kind === "cards");
    expect(cards).toBeDefined();
  });
});
