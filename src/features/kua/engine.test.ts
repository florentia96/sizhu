import { describe, it, expect } from "vitest";
import { engine, kuaNumber, reduceSingle, sumDigits } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

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
});
