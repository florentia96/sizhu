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
  it("neutral pair scores 70", () => {
    expect((engine.build(["ชวด", "เถาะ"])[0] as Extract<Section, { kind: "compat" }>).score).toBe(70);
  });
  it("schema valid + deterministic + invalid input note", () => {
    const a = engine.build(["ชวด", "ฉลู"]);
    const b = engine.build(["ชวด", "ฉลู"]);
    expect(ReportSchema.parse(a)).toBeTruthy();
    expect(a).toEqual(b);
    expect(engine.build(["", ""])[0].kind).toBe("note");
  });
});
