import { describe, it, expect } from "vitest";
import { engine, zodiacYearForCE } from "./engine";
import { EL_LIFE, ANIMAL_GUIDE } from "./content";
import { ZODIAC, STEM_EL } from "../_shared/sixtyCycle";
import type { Section } from "../../shared/sections/types";

function head(out: Section[]) {
  return out.find((s) => s.kind === "prose") as Extract<Section, { kind: "prose" }>;
}

describe("zodiacyear content correctness", () => {
  it("the 12 Thai zodiac names are exact and in order", () => {
    expect(ZODIAC.map((z) => z.th)).toEqual([
      "ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง",
      "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน",
    ]);
  });

  // นักษัตร + ธาตุ ตามรอบ 60 ปี (sexagenary) อ้างอิงปีหลักที่ทราบแน่ชัด
  const vectors: { ce: number; th: string; el: string }[] = [
    { ce: 1924, th: "ชวด", el: "ไม้" },   // 甲子
    { ce: 1984, th: "ชวด", el: "ไม้" },   // 甲子
    { ce: 1992, th: "วอก", el: "น้ำ" },   // 壬申
    { ce: 2000, th: "มะโรง", el: "ทอง" }, // 庚辰
    { ce: 2008, th: "ชวด", el: "ดิน" },   // 戊子
    { ce: 2020, th: "ชวด", el: "ทอง" },   // 庚子
    { ce: 2021, th: "ฉลู", el: "ทอง" },   // 辛丑
    { ce: 2022, th: "ขาล", el: "น้ำ" },   // 壬寅
    { ce: 2023, th: "เถาะ", el: "น้ำ" },  // 癸卯
    { ce: 2024, th: "มะโรง", el: "ไม้" }, // 甲辰
  ];

  it.each(vectors)("CE $ce -> ปี$th ธาตุ$el", ({ ce, th, el }) => {
    const zi = zodiacYearForCE(ce);
    expect(ZODIAC[zi].th).toBe(th);
    expect(STEM_EL[(((ce % 10) + 10) % 10)][0]).toBe(el);
  });

  it("yin/yang follows even/odd CE year (yang=even stem)", () => {
    // 2024 = 甲 (yang) ; 2025 = 乙 (yin)
    const yang = head(engine.build(["2024"]));
    const yin = head(engine.build(["2025"]));
    expect(JSON.stringify(yang.paras)).toContain("หยาง");
    expect(JSON.stringify(yin.paras)).toContain("หยิน");
  });
});

describe("zodiacyear data tables", () => {
  it("EL_LIFE covers all five elements with full life areas", () => {
    for (const el of ["ไม้", "ไฟ", "ดิน", "ทอง", "น้ำ"]) {
      const e = EL_LIFE[el];
      expect(e, el).toBeTruthy();
      for (const k of ["nature", "career", "wealth", "love", "health", "advice"] as const) {
        expect(e[k].length, `${el}.${k}`).toBeGreaterThan(10);
      }
    }
  });

  it("ANIMAL_GUIDE has one complete entry per zodiac (12)", () => {
    expect(ANIMAL_GUIDE.length).toBe(12);
    for (let i = 0; i < 12; i++) {
      const g = ANIMAL_GUIDE[i];
      expect(g.strength.length, `${i}.strength`).toBeGreaterThan(3);
      expect(g.watch.length, `${i}.watch`).toBeGreaterThan(3);
      expect(g.tip.length, `${i}.tip`).toBeGreaterThan(10);
    }
  });
});

describe("zodiacyear result completeness", () => {
  const out = engine.build(["2535"]); // 1992 Water Monkey

  it("includes a year-characteristics prose section", () => {
    const sec = out.find(
      (s) => s.kind === "prose" && s.title.includes("ลักษณะเด่น"),
    ) as Extract<Section, { kind: "prose" }> | undefined;
    expect(sec).toBeTruthy();
    expect(sec!.paras.some((p) => p.h === "จุดแข็ง")).toBe(true);
    expect(sec!.paras.some((p) => p.h === "จุดที่ควรระวัง")).toBe(true);
  });

  it("includes a life-overview grid with career/wealth/love/health", () => {
    const sec = out.find(
      (s) => s.kind === "grid" && s.title.includes("ภาพรวมดวงชะตา"),
    ) as Extract<Section, { kind: "grid" }> | undefined;
    expect(sec).toBeTruthy();
    const names = sec!.cells.map((c) => c.name);
    expect(names).toEqual(["การงาน", "การเงิน", "ความรัก", "สุขภาพ"]);
    for (const c of sec!.cells) expect(c.note && c.note.length).toBeGreaterThan(10);
  });

  it("includes a guidance prose section with non-empty advice", () => {
    const sec = out.find(
      (s) => s.kind === "prose" && s.title.includes("คำแนะนำ"),
    ) as Extract<Section, { kind: "prose" }> | undefined;
    expect(sec).toBeTruthy();
    expect(sec!.paras.length).toBeGreaterThanOrEqual(2);
    for (const p of sec!.paras) expect(p.t.length).toBeGreaterThan(10);
  });

  it("still includes compatibility blocks (5 relations incl. 刑) and a note", () => {
    const blocks = out.find((s) => s.kind === "blocks") as Extract<Section, { kind: "blocks" }> | undefined;
    expect(blocks).toBeTruthy();
    expect(blocks!.items.length).toBe(5);
    expect(blocks!.items.some((i) => i.title.includes("刑"))).toBe(true);
    expect(out.some((s) => s.kind === "note")).toBe(true);
  });

  it("produces a substantially richer report (>= 8 sections)", () => {
    expect(out.length).toBeGreaterThanOrEqual(8);
  });
});

describe("zodiacyear tone", () => {
  const out = engine.build(["2535"]);
  const text = JSON.stringify(out);

  it("uses polite-neutral voice (no ครับ/ค่ะ/jargon slang)", () => {
    expect(text).not.toContain("ครับ");
    expect(text).not.toContain("ค่ะ");
    expect(text).not.toContain("จ้า");
    expect(text).not.toContain("นะคะ");
  });

  it("does not stack 3+ list items with ' · ' separators", () => {
    // grid values now use comma; ensure no ' · ' appears anywhere in output strings
    expect(text).not.toContain(" · ");
  });

  it("glosses Chinese relationship terms with their hanzi", () => {
    expect(text).toContain("ซานเหอ 三合");
    expect(text).toContain("ลิ่วเหอ 六合");
  });
});
