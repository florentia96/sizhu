import { describe, it, expect } from "vitest";
import { engine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";
import type { Section } from "../../shared/sections/types";

describe("zodiaccompat engine", () => {
  it("ลิ่วเหอ pair ชวด+ฉลู scores 95", () => {
    const out = engine.build(["ชวด", "ฉลู"]);
    const c = out[0] as Extract<Section, { kind: "compat" }>;
    expect(c.kind).toBe("compat");
    expect(c.score).toBe(95);
  });
  it("ซานเหอ trine ชวด+มะโรง scores 90", () => {
    expect((engine.build(["ชวด", "มะโรง"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(90);
  });
  it("clash ชวด+มะเมีย scores 42", () => {
    expect((engine.build(["ชวด", "มะเมีย"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(42);
  });
  it("harm ชวด+มะแม scores 55", () => {
    expect((engine.build(["ชวด", "มะแม"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(55);
  });
  it("same animal scores 78", () => {
    expect((engine.build(["ขาล", "ขาล"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(78);
  });
  it("neutral pair ชวด+ขาล scores 70", () => {
    expect((engine.build(["ชวด", "ขาล"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(70);
  });
  it("xing (互刑) ชวด+เถาะ scores 50 — was wrongly neutral before", () => {
    expect((engine.build(["ชวด", "เถาะ"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(50);
  });
  it("clash AND xing เสือ+ลิง stays clash 42 with extra 相刑 caveat point", () => {
    const c = engine.build(["ขาล", "วอก"])[0] as Extract<Section, { kind: "compat" }>;
    expect(c.score).toBe(42);
    expect(c.points.some((p) => p.title.indexOf("相刑") >= 0)).toBe(true);
  });
  it("self-xing (自刑) มะโรง+มะโรง stays 78 with 自刑 caveat point", () => {
    const c = engine.build(["มะโรง", "มะโรง"])[0] as Extract<Section, { kind: "compat" }>;
    expect(c.score).toBe(78);
    expect(c.points.some((p) => p.title.indexOf("自刑") >= 0)).toBe(true);
  });
  it("result is rich — compat + 2 grids + prose + note, with element grid", () => {
    const out = engine.build(["ชวด", "ฉลู"]);
    expect(out).toHaveLength(5);
    expect(out.filter((s) => s.kind === "grid")).toHaveLength(2);
    expect(out.some((s) => s.kind === "grid" && s.title === "ธาตุประจำนักษัตร")).toBe(true);
    expect(out.some((s) => s.kind === "prose")).toBe(true);
  });
  it("schema valid + deterministic + invalid input note", () => {
    const a = engine.build(["ชวด", "ฉลู"]);
    const b = engine.build(["ชวด", "ฉลู"]);
    expect(ReportSchema.parse(a)).toBeTruthy();
    expect(a).toEqual(b);
    expect(engine.build(["", ""])[0].kind).toBe("note");
  });
});
