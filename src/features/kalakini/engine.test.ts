import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { kalakiniEngine } from "./engine";
import { kalakiniFields } from "./fields";
import { kalakiniMeta } from "./meta";

type Out = ReturnType<typeof kalakiniEngine.build>;
type Blocks = Extract<Out[number], { kind: "blocks" }>;
type Grid = Extract<Out[number], { kind: "grid" }>;
type Verdict = Extract<Out[number], { kind: "verdict" }>;

const blocksOf = (out: Out) => out.find((s) => s.kind === "blocks") as Blocks;
const gridOf = (out: Out) => out.find((s) => s.kind === "grid") as Grid;
const kalaBlock = (out: Out) =>
  blocksOf(out).items.find((b) => b.title.includes("กาลกิณี"))!;

describe("kalakini engine", () => {
  it("meta + fields shape", () => {
    expect(kalakiniMeta.id).toBe("kalakini");
    expect(kalakiniFields).toHaveLength(1);
    expect(kalakiniFields[0]).toMatchObject({ type: "select" });
    const opts = (kalakiniFields[0] as { options: string[] }).options;
    expect(opts).toHaveLength(8);
    expect(opts).toContain("พุธ (กลางคืน)");
  });

  it("ARCHITECTURE GUARD: weekday field label/type/options are unchanged (home auto-fill)", () => {
    const f = kalakiniFields[0] as { label: string; type: string; options: string[] };
    expect(f.label).toBe("วันเกิด");
    expect(f.type).toBe("select");
    expect(f.options).toEqual([
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ (กลางวัน)",
      "พุธ (กลางคืน)",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ]);
  });

  it("satisfies ReportSchema for every weekday option", () => {
    const opts = (kalakiniFields[0] as { options: string[] }).options;
    for (const day of opts) {
      const out = kalakiniEngine.build([day]);
      expect(() => ReportSchema.parse(out)).not.toThrow();
    }
  });

  it("is deterministic", () => {
    const a = kalakiniEngine.build(["อาทิตย์"]);
    const b = kalakiniEngine.build(["อาทิตย์"]);
    expect(a).toEqual(b);
  });

  it("reference vector: Sunday-born กาลกิณี group = ศุกร์ letters ศ ษ ส ห ฬ ฮ", () => {
    const out = kalakiniEngine.build(["อาทิตย์"]);
    const kala = kalaBlock(out);
    expect(kala.tag).toBe("หลีกเลี่ยง");
    expect(kala.accent).toBe("#e0584b");
    expect(kala.chips).toEqual(["ศ", "ษ", "ส", "ห", "ฬ", "ฮ"]);
  });

  // Kalakini per birthday - verified against the Taksapakorn wheel
  // (Kalakini = the planet one step before the birth planet on the wheel)
  it.each([
    ["อาทิตย์", ["ศ", "ษ", "ส", "ห", "ฬ", "ฮ"]], // Venus
    ["จันทร์", ["อ", "า", "ิ", "ี", "ึ", "ื", "ุ", "ู", "เ", "แ", "โ", "ใ", "ไ"]], // Sun
    ["อังคาร", ["ก", "ข", "ค", "ฆ", "ง"]], // Moon
    ["พุธ (กลางวัน)", ["จ", "ฉ", "ช", "ซ", "ฌ", "ญ"]], // Mars
    ["พุธ (กลางคืน)", ["บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม"]], // Jupiter
    ["พฤหัสบดี", ["ด", "ต", "ถ", "ท", "ธ", "น"]], // Saturn
    ["ศุกร์", ["ย", "ร", "ล", "ว"]], // Rahu
    ["เสาร์", ["ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ"]], // Mercury
  ])("กาลกิณี mapping for %s", (day, letters) => {
    const out = kalakiniEngine.build([day]);
    expect(kalaBlock(out).chips).toEqual(letters);
  });

  it("พุธกลางคืน uses ราหู base (not พุธ daytime base)", () => {
    const night = kalakiniEngine.build(["พุธ (กลางคืน)"]);
    const dayWed = kalakiniEngine.build(["พุธ (กลางวัน)"]);
    expect(kalaBlock(night).chips).not.toEqual(kalaBlock(dayWed).chips);
    // night-born: borriwan starts on Rahu -> Kalakini = Jupiter group
    expect(kalaBlock(night).chips).toContain("บ");
  });

  it("blocks cover ALL 8 ภูมิ with letters + meaning (completeness)", () => {
    const out = kalakiniEngine.build(["จันทร์"]);
    const items = blocksOf(out).items;
    expect(items).toHaveLength(8);
    const bhumiNames = ["บริวาร", "อายุ", "เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี", "กาลกิณี"];
    for (const name of bhumiNames) {
      expect(items.some((b) => b.title.includes(name))).toBe(true);
    }
    for (const b of items) {
      expect(b.chips.length).toBeGreaterThan(0);
      expect(b.text.length).toBeGreaterThan(0);
    }
  });

  it("กาลกิณี block is tone bad; the 5 มงคล blocks are tone good", () => {
    const out = kalakiniEngine.build(["อาทิตย์"]);
    const items = blocksOf(out).items;
    expect(kalaBlock(out).accent).toBe("#e0584b");
    const goodBhumi = ["เดช", "ศรี", "มูละ", "อุตสาหะ", "มนตรี"];
    for (const name of goodBhumi) {
      const blk = items.find((b) => b.title.includes(name))!;
      expect(blk.accent).toBe("#6cc18a");
    }
  });

  it("leads with a verdict that names the กาลกิณี planet + letters", () => {
    const out = kalakiniEngine.build(["เสาร์"]);
    const v = out.find((s) => s.kind === "verdict") as Verdict;
    expect(v).toBeTruthy();
    expect(v.summary).toContain("เสาร์");
    expect(v.summary).toContain("พุธ"); // Kalakini planet for Saturn-born
    expect(v.summary).toContain("ฎ"); // a Kalakini letter
  });

  it("emits a full 8-ภูมิ grid", () => {
    const out = kalakiniEngine.build(["จันทร์"]);
    const grid = gridOf(out);
    expect(grid.title).toBe("ตารางอ้างอิง 8 ภูมิ");
    expect(grid.cells).toHaveLength(8);
  });

  it("includes practical naming guidance (no thin result)", () => {
    const out = kalakiniEngine.build(["อาทิตย์"]);
    const guide = out.filter((s) => s.kind === "prose");
    expect(guide.length).toBeGreaterThanOrEqual(2);
    expect(out.length).toBeGreaterThanOrEqual(5);
  });

  it("polite-neutral tone: no ครับ/ค่ะ/slang particles in any text", () => {
    // particles are delimited by whitespace/end-of-string to avoid false positives, e.g. the word for "boss" contains the particle "chaa"
    const PARTICLE = /(^|[\s"])(ครับ|ค่ะ|คะ|จ้า|จ้ะ|นะคะ|เนอะ|อ่ะ)([\s".,]|$)/;
    const opts = (kalakiniFields[0] as { options: string[] }).options;
    for (const d of opts) {
      for (const sec of kalakiniEngine.build([d])) {
        expect(JSON.stringify(sec)).not.toMatch(PARTICLE);
      }
    }
  });

  it("empty/unknown input falls back without throwing", () => {
    const out = kalakiniEngine.build([""]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
});
