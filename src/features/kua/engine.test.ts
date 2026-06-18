import { describe, it, expect } from "vitest";
import { engine, kuaNumber, reduceSingle, sumDigits } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("kua engine", () => {
  it("digit helpers", () => {
    expect(sumDigits("1984")).toBe(22);
    expect(reduceSingle(22)).toBe(4);
    expect(reduceSingle(19)).toBe(1);
  });
  it("reference vector: 1984 male -> kua 6 (West)", () => {
    expect(kuaNumber(1984, "ชาย")).toBe(6);
  });
  it("reference vector: 1990 female -> kua 6", () => {
    expect(kuaNumber(1990, "หญิง")).toBe(6);
  });
  it("male center 5 -> 2, female center 5 -> 8", () => {
    expect(kuaNumber(1976, "ชาย")).toBe(2);
    expect(kuaNumber(1980, "หญิง")).toBe(8);
  });
  it("2000+ branch: 2001 male -> 9-3=6", () => {
    expect(kuaNumber(2001, "ชาย")).toBe(6);
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
