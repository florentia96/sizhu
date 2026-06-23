import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { nameanalyzeEngine } from "./engine";
import { nameanalyzeFields } from "./fields";
import { nameanalyzeMeta } from "./meta";

describe("nameanalyze engine — taksa core", () => {
  it("meta + fields shape", () => {
    expect(nameanalyzeMeta.id).toBe("nameanalyze");
    expect(nameanalyzeFields).toHaveLength(3);
    expect(nameanalyzeFields[2]).toMatchObject({ type: "select" });
  });

  it("empty name returns a note (no throw)", () => {
    const out = nameanalyzeEngine.build(["", "", "อาทิตย์"]);
    expect(out).toEqual([{ kind: "note", text: "กรุณากรอกชื่อจริงเพื่อวิเคราะห์" }]);
  });

  it("satisfies ReportSchema", () => {
    const out = nameanalyzeEngine.build(["ธนกฤต", "ใจดี", "อาทิตย์"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });

  it("is deterministic", () => {
    const a = nameanalyzeEngine.build(["สมชาย", "", "อาทิตย์"]);
    const b = nameanalyzeEngine.build(["สมชาย", "", "อาทิตย์"]);
    expect(a).toEqual(b);
  });

  it("reference vector: Sunday-born name with ส flags กาลกิณี (ศุกร์ group)", () => {
    // Sunday kalakini = Venus letter group; the name "som" contains "so" (kala) and "mo" (good, montri/borriwan group)
    const out = nameanalyzeEngine.build(["สม", "", "อาทิตย์"]);
    const verdict = out.find((s) => s.kind === "verdict") as Extract<typeof out[number], { kind: "verdict" }>;
    expect(verdict.gradeLabel).toBe("มีอักษรกาลกิณี");
    expect(verdict.accent).toBe("#e0584b");
    const blocks = out.filter((s) => s.kind === "blocks") as Extract<typeof out[number], { kind: "blocks" }>[];
    const kalaBlock = blocks.find((b) => b.items[0].tag === "กาลกิณี");
    expect(kalaBlock).toBeDefined();
    expect(kalaBlock!.items[0].chips).toContain("ส");
  });

  it("reference vector: clean name for Sunday has no กาลกิณี block + score capped 25..96", () => {
    // "kok" = Moon group, never kalakini for Sunday
    const out = nameanalyzeEngine.build(["กก", "", "อาทิตย์"]);
    const verdict = out.find((s) => s.kind === "verdict") as Extract<typeof out[number], { kind: "verdict" }>;
    expect(verdict.score).toBeGreaterThanOrEqual(25);
    expect(verdict.score).toBeLessThanOrEqual(96);
    expect(verdict.gradeLabel).not.toBe("มีอักษรกาลกิณี");
  });

  it("regression: Monday-born flags vowel กาลกิณี (อาทิตย์ group ิ ี ึ ื ุ ู must not be stripped)", () => {
    // Monday-born -> the vowel group (Sun) becomes kalakini - the name "phuri" has the vowels uu and i which are kalakini
    const out = nameanalyzeEngine.build(["ภูริ", "", "จันทร์"]);
    const verdict = out.find((s) => s.kind === "verdict") as Extract<typeof out[number], { kind: "verdict" }>;
    expect(verdict.gradeLabel).toBe("มีอักษรกาลกิณี");
    const blocks = out.filter((s) => s.kind === "blocks") as Extract<typeof out[number], { kind: "blocks" }>[];
    const kalaBlock = blocks.find((b) => b.items[0].tag === "กาลกิณี");
    expect(kalaBlock).toBeDefined();
    expect(kalaBlock!.items[0].chips).toContain("ู");
    expect(kalaBlock!.items[0].chips).toContain("ิ");
  });

  it("per-letter breakdown lists every mapped letter with its ภูมิ", () => {
    // "som" for Sunday: "so"=kalakini (Venus group), "mo" in Jupiter group=WHEEL[5]->BHUMI[5]=utsaha (good)
    const out = nameanalyzeEngine.build(["สม", "", "อาทิตย์"]);
    const rows = out.find(
      (s) => s.kind === "rows" && s.title === "อักษรแต่ละตัวในชื่ออยู่ภูมิใด",
    ) as Extract<typeof out[number], { kind: "rows" }>;
    expect(rows).toBeDefined();
    expect(rows.items.map((i) => i.n)).toEqual(["ส", "ม"]);
    const so = rows.items.find((i) => i.n === "ส")!;
    expect(so.title).toBe("กาลกิณี");
    expect(so.fg).toBe("#e0584b"); // bad tone
    const mo = rows.items.find((i) => i.n === "ม")!;
    expect(mo.fg).toBe("#6cc18a"); // good tone (montri)
  });

  it("includes a keep/change guidance prose with a clear verdict heading", () => {
    const bad = nameanalyzeEngine.build(["สม", "", "อาทิตย์"]);
    const gBad = bad.find(
      (s) => s.kind === "prose" && s.title === "คำแนะนำ: เก็บชื่อเดิมหรือเปลี่ยน",
    ) as Extract<typeof bad[number], { kind: "prose" }>;
    expect(gBad).toBeDefined();
    expect(gBad.accent).toBe("#e0584b");
    expect(gBad.paras[0].h).toContain("ควรพิจารณาปรับชื่อ");

    const ok = nameanalyzeEngine.build(["ธนกฤต", "", "อาทิตย์"]);
    const gOk = ok.find(
      (s) => s.kind === "prose" && s.title === "คำแนะนำ: เก็บชื่อเดิมหรือเปลี่ยน",
    ) as Extract<typeof ok[number], { kind: "prose" }>;
    expect(gOk.accent).toBe("#6cc18a");
    expect(gOk.paras[0].h).toContain("ใช้ได้ตามหลักทักษา");
  });

  it("result is substantial (multiple sections incl numerology meaning)", () => {
    const out = nameanalyzeEngine.build(["ธนกฤต", "ใจดี", "อาทิตย์"]);
    expect(out.length).toBeGreaterThanOrEqual(6);
    const numMeaning = out.find(
      (s) => s.kind === "prose" && s.title === "ความหมายเลขศาสตร์ของชื่อ",
    );
    expect(numMeaning).toBeDefined();
  });

  it("polite-neutral tone: no gendered particles anywhere in output", () => {
    const out = nameanalyzeEngine.build(["สมหญิง", "ศรีสุข", "ศุกร์"]);
    const blob = JSON.stringify(out);
    // "khrap"/"kha" are unambiguous gendered finals; bare "kha" collides with "khanaen" (a noun), so excluded
    expect(blob).not.toMatch(/ครับ/);
    expect(blob).not.toMatch(/ค่ะ/);
  });
});
