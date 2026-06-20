import { describe, it, expect } from "vitest";
import { engine, kuaNumber, reduceSingle, sumDigits } from "./engine";
import { ReportSchema } from "../../shared/sections/types";
import type { Section } from "../../shared/sections/types";

describe("kua engine", () => {
  it("digit helpers", () => {
    expect(sumDigits("1984")).toBe(22);
    expect(reduceSingle(22)).toBe(4);
    expect(reduceSingle(19)).toBe(1);
  });
  // ค่าอ้างอิงจากสูตร Eight Mansions มาตรฐาน (2 หลักท้าย)
  // ที่มา: prokerala.com/feng-shui/kua-number.php, calculator.academy/kua-number-calculator, lovetoknow.com
  it("reference vector: 1978 male -> kua 4 (prokerala worked example: 7+8=15→6, 10-6=4)", () => {
    expect(kuaNumber(1978, "ชาย")).toBe(4);
  });
  it("reference vector: 1984 male -> kua 7 (8+4=12→3, 10-3=7)", () => {
    expect(kuaNumber(1984, "ชาย")).toBe(7);
  });
  it("reference vector: 1990 female -> kua 8 (90→9, 9+5=14→5, หญิง 5→8)", () => {
    expect(kuaNumber(1990, "หญิง")).toBe(8);
  });
  it("male center 5 -> 2 (1968: 6+8=14→5, 10-5=5, ชาย 5→2)", () => {
    expect(kuaNumber(1968, "ชาย")).toBe(2);
  });
  it("2000s branch uses 9-S / S+6", () => {
    expect(kuaNumber(2000, "ชาย")).toBe(9); // 00→0, 9-0=9
    expect(kuaNumber(2001, "ชาย")).toBe(8); // 01→1, 9-1=8
    expect(kuaNumber(2002, "หญิง")).toBe(8); // 02→2, 2+6=8
  });
  it("report has verdict, blocks(good), grid(bad), prose, note; schema valid", () => {
    const out = engine.build(["2535", "ชาย"]);
    expect(ReportSchema.parse(out)).toBeTruthy();
    expect(out[0].kind).toBe("verdict");
    expect(out.some((s) => s.kind === "blocks")).toBe(true);
    expect(out.some((s) => s.kind === "grid")).toBe(true);
  });
  it("deterministic + missing gender returns note", () => {
    const a = engine.build(["2535", "ชาย"]);
    const b = engine.build(["2535", "ชาย"]);
    expect(a).toEqual(b);
    expect(engine.build(["", ""])[0].kind).toBe("note");
  });

  // completeness: result must be rich, not thin
  it("good section: 4 directions, each with meaning + how-to-use", () => {
    const out = engine.build(["2535", "ชาย"]);
    const good = out.find((s) => s.kind === "blocks") as Extract<Section, { kind: "blocks" }>;
    expect(good.items).toHaveLength(4);
    for (const it of good.items) {
      expect(it.tag).toMatch(/ทิศ|เฉียง/); // a Thai direction name
      expect(it.text).toContain("วิธีใช้");
      expect(it.text.length).toBeGreaterThan(30);
      expect(it.chips.length).toBeGreaterThan(0);
    }
  });
  it("bad section: 4 directions, each with meaning + how-to-handle", () => {
    const out = engine.build(["2535", "ชาย"]);
    const bad = out.find((s) => s.kind === "grid") as Extract<Section, { kind: "grid" }>;
    expect(bad.cells).toHaveLength(4);
    for (const c of bad.cells) {
      expect(c.value).toMatch(/ทิศ|เฉียง/);
      expect(c.note ?? "").toContain("วิธีรับมือ");
    }
  });
  it("has group explanation + practical guidance covering desk/bed/stove/door", () => {
    const out = engine.build(["2535", "ชาย"]);
    const proses = out.filter((s) => s.kind === "prose") as Extract<Section, { kind: "prose" }>[];
    expect(proses.length).toBeGreaterThanOrEqual(2);
    const titles = proses.map((p) => p.title);
    expect(titles).toContain("กลุ่มทิศของคุณ");
    const usage = proses.find((p) => p.title === "นำไปใช้จริงในบ้าน")!;
    const heads = usage.paras.map((p) => p.h ?? "");
    expect(heads).toContain("โต๊ะทำงาน");
    expect(heads).toContain("หัวเตียงนอน");
    expect(heads).toContain("เตาไฟและครัว");
    expect(heads.some((h) => h.includes("ประตูหลัก"))).toBe(true);
  });

  // tone: polite-neutral, no gendered particles, no obscure jargon without gloss
  it("no gendered particles or slang anywhere in output text", () => {
    const blob = JSON.stringify(engine.build(["2535", "หญิง"]));
    expect(blob).not.toMatch(/ครับ|ค่ะ|คะ|นะคะ|จ้า|จ้ะ|เด้อ/);
    expect(blob).not.toContain("โป๊ยแถ่ว"); // niche Chinese reading -> use ฮวงจุ้ยแปดทิศ
  });
});
