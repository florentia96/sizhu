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
      expect(idcardFields[0].options).toEqual(["บัตรประชาชน", "บ้าน", "บัญชี"]);
    }
    expect(idcardFields[1].type).toBe("text");
    expect(idcardFields[1].label).toBe("เลข");
  });
});

describe("idcard engine", () => {
  it("output satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(idcardEngine.build(["บ้าน", "199/24"]))).not.toThrow();
  });
  it("is deterministic", () => {
    const a = idcardEngine.build(["บัญชี", "1234567890"]);
    const b = idcardEngine.build(["บัญชี", "1234567890"]);
    expect(a).toEqual(b);
  });
  it("uses vals[1] (the number), not vals[0] (the type label)", () => {
    const withType = idcardEngine.build(["บ้าน", "199/24"]);
    const numOnly = idcardEngine.build(["", "199/24"]);
    expect(withType).toEqual(numOnly);
  });
  it("falls back to vals[0] when vals[1] empty -> type label has no digits -> note", () => {
    const out = idcardEngine.build(["บ้าน", ""]);
    expect(out).toEqual([{ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" }]);
  });
  it("reference vector: 199/24 -> verdict score in 22..98", () => {
    const out = idcardEngine.build(["บ้าน", "199/24"]);
    const v = out.find((s) => s.kind === "verdict");
    expect(v && v.kind === "verdict" && v.score >= 22 && v.score <= 98).toBe(true);
  });
});
