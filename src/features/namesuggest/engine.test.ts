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

  it("prefix matching no name returns a no-match note, not unfiltered names (regression)", () => {
    const out = namesuggestEngine.build(["1990-01-07", "ชาย", "ฮฮฮ"]);
    expect(out.some((s) => s.kind === "cards")).toBe(false);
    expect(out.some((s) => s.kind === "note")).toBe(true);
  });

  it("every weekday + gender yields >= 9 kalakini-free suggestions (no thin result)", () => {
    // covers every day, including Monday whose kalakini is the entire vowel group (the thinnest case)
    const dates: Record<string, string> = {
      อาทิตย์: "2024-06-16",
      จันทร์: "2024-06-17",
      อังคาร: "2024-06-18",
      พุธ: "2024-06-19",
      พฤหัสบดี: "2024-06-20",
      ศุกร์: "2024-06-21",
      เสาร์: "2024-06-22",
    };
    for (const date of Object.values(dates)) {
      for (const gender of ["หญิง", "ชาย", "ไม่ระบุ"]) {
        const out = namesuggestEngine.build([date, gender, ""]);
        const cards = out.find((s) => s.kind === "cards") as Extract<typeof out[number], { kind: "cards" }>;
        expect(cards).toBeDefined();
        expect(cards.items.length).toBe(9);
      }
    }
  });

  it("ranks auspicious-lead names first: the top suggestion leads with a เดช/ศรี letter when one exists", () => {
    const date = "2024-06-19"; // Wednesday
    const day = dayFromDate(2024, 6, 19);
    const t = taksaForDay(day);
    const dechSri = new Set(t[2].letters.concat(t[3].letters));
    for (const gender of ["หญิง", "ชาย", "ไม่ระบุ"]) {
      const out = namesuggestEngine.build([date, gender, ""]);
      const cards = out.find((s) => s.kind === "cards") as Extract<typeof out[number], { kind: "cards" }>;
      // there are kalakini-free names whose leading letter is decha/sri -> they must be ranked first
      expect(dechSri.has(cards.items[0].value[0])).toBe(true);
    }
  });

  it("auspicious-lead names carry their bhumi group in the note", () => {
    const out = namesuggestEngine.build(["2024-06-19", "หญิง", ""]);
    const cards = out.find((s) => s.kind === "cards") as Extract<typeof out[number], { kind: "cards" }>;
    const day = dayFromDate(2024, 6, 19);
    const t = taksaForDay(day);
    // skip leading vowels to catch the real initial consonant, matching leadBhumi in the engine
    const lead = (nm: string) => {
      const ch = [...nm].find((c) => !"เแโใไ".includes(c)) ?? nm[0];
      return t.find((c) => c.letters.indexOf(ch) >= 0)?.bhumi ?? "";
    };
    for (const item of cards.items) {
      const b = lead(item.value);
      if (["เดช", "ศรี", "มนตรี", "มูละ", "อุตสาหะ"].indexOf(b) >= 0) {
        expect(item.note).toContain("อักษรนำหมู่" + b);
      }
    }
  });

  it("includes a choosing-guidance prose section when results exist", () => {
    const out = namesuggestEngine.build(["1990-01-07", "หญิง", ""]);
    expect(out.some((s) => s.kind === "prose")).toBe(true);
  });

  it("output stays polite-neutral: no ครับ/ค่ะ particles", () => {
    const out = namesuggestEngine.build(["1990-01-07", "หญิง", ""]);
    const blob = JSON.stringify(out);
    expect(blob).not.toMatch(/ครับ|ค่ะ|จ้า|นะคะ/);
  });
});
