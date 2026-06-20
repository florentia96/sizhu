import { describe, it, expect } from "vitest";
import { idcardMeta } from "./meta";
import { idcardFields } from "./fields";
import { idcardEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

describe("idcard meta + fields", () => {
  it("meta has correct id", () => {
    expect(idcardMeta.id).toBe("idcard");
    expect(idcardMeta.name).toBeTruthy();
    expect(idcardMeta.cn).toBeTruthy();
    expect(idcardMeta.desc).toBeTruthy();
    expect(idcardMeta.long).toBeTruthy();
  });
  it("fields = [ประเภท(select), เลข(text)] in that order", () => {
    expect(idcardFields).toHaveLength(2);
    expect(idcardFields[0].type).toBe("select");
    if (idcardFields[0].type === "select") {
      expect(idcardFields[0].options).toEqual(["บัตรประชาชน", "เลขที่บ้าน", "เลขบัญชีธนาคาร"]);
    }
    expect(idcardFields[1].type).toBe("text");
    expect(idcardFields[1].label).toBe("เลข");
  });
  it("number field caps at 15 digits, is numeric, and hints the per-type length", () => {
    const numField = idcardFields[1];
    expect(numField.type).toBe("text");
    if (numField.type === "text") {
      expect(numField.maxLength).toBe(15);
      expect(numField.inputMode).toBe("numeric");
      expect(numField.placeholder).toBe("1234567890123");
      expect(numField.hint).toContain("13");
    }
  });
});

describe("idcard engine", () => {
  it("output satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(idcardEngine.build(["เลขที่บ้าน", "199/24"]))).not.toThrow();
  });
  it("is deterministic", () => {
    const a = idcardEngine.build(["เลขบัญชีธนาคาร", "1234567890"]);
    const b = idcardEngine.build(["เลขบัญชีธนาคาร", "1234567890"]);
    expect(a).toEqual(b);
  });
  it("the selected type drives the result label (regression: dropdown was a no-op)", () => {
    const home = JSON.stringify(idcardEngine.build(["เลขที่บ้าน", "199/24"]));
    const acc = JSON.stringify(idcardEngine.build(["เลขบัญชีธนาคาร", "199/24"]));
    expect(home).toContain("เลขที่บ้าน");
    expect(acc).toContain("เลขบัญชีธนาคาร");
    expect(home).not.toEqual(acc);
  });
  it("บัตรประชาชน must be exactly 13 digits", () => {
    expect(idcardEngine.build(["บัตรประชาชน", "12345"])[0].kind).toBe("note");
    const ok = idcardEngine.build(["บัตรประชาชน", "1101700203451"]);
    expect(ok.some((s) => s.kind === "verdict")).toBe(true);
  });
  it("empty number returns a guidance note", () => {
    const out = idcardEngine.build(["เลขที่บ้าน", ""]);
    expect(out).toEqual([{ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" }]);
  });
  it("reference vector: 199/24 -> verdict score in 22..98", () => {
    const out = idcardEngine.build(["เลขที่บ้าน", "199/24"]);
    const v = out.find((s) => s.kind === "verdict");
    expect(v && v.kind === "verdict" && v.score >= 22 && v.score <= 98).toBe(true);
  });
  it("a valid result leads with a note naming the analyzed number type", () => {
    const out = idcardEngine.build(["เลขบัญชีธนาคาร", "1234567890"]);
    expect(out[0].kind).toBe("note");
    expect(out[0].kind === "note" && out[0].text).toContain("เลขบัญชีธนาคาร");
    expect(out.some((s) => s.kind === "verdict")).toBe(true);
  });
  it("accepts a 15-digit bank account (within maxLength cap)", () => {
    const out = idcardEngine.build(["เลขบัญชีธนาคาร", "123456789012345"]);
    expect(out.some((s) => s.kind === "verdict")).toBe(true);
  });
  it("the wrong-length message for บัตรประชาชน is polite and states both counts", () => {
    const out = idcardEngine.build(["บัตรประชาชน", "12345"]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe("note");
    if (out[0].kind === "note") {
      expect(out[0].text).toContain("13");
      expect(out[0].text).toContain("5");
      expect(out[0].text).toContain("กรุณา");
    }
  });
});
