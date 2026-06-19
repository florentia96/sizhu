import { describe, it, expect } from "vitest";
import { RULER, EL_COMPAT, EL_LOVE, EL_NOTE } from "./content";

describe("rasi content", () => {
  it("RULER covers 12 Thai signs", () => {
    expect(Object.keys(RULER)).toHaveLength(12);
    expect(RULER["เมษ"]).toBe("อังคาร");
    expect(RULER["มังกร"]).toBe("เสาร์");
  });
  it("EL_COMPAT pairs fire<->air, water<->earth", () => {
    expect(EL_COMPAT["ไฟ"]).toBe("ลม");
    expect(EL_COMPAT["ลม"]).toBe("ไฟ");
    expect(EL_COMPAT["น้ำ"]).toBe("ดิน");
    expect(EL_COMPAT["ดิน"]).toBe("น้ำ");
  });
  it("EL_LOVE has love+work for all 4 elements", () => {
    ["ไฟ", "ดิน", "ลม", "น้ำ"].forEach((e) => {
      expect(typeof EL_LOVE[e].love).toBe("string");
      expect(typeof EL_LOVE[e].work).toBe("string");
    });
  });
  it("EL_NOTE has all 4 elements", () => {
    expect(Object.keys(EL_NOTE).sort()).toEqual(["ดิน", "น้ำ", "ลม", "ไฟ"]);
  });
});
