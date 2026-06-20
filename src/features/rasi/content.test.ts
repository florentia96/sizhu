import { describe, it, expect } from "vitest";
import {
  RULER,
  EL_COMPAT,
  EL_CLASH,
  EL_LOVE,
  EL_NOTE,
  EL_SHORT,
  EL_GUIDE,
} from "./content";
import { RASI } from "../_shared/thaiAstro";

const ELEMENTS = ["ไฟ", "ดิน", "ลม", "น้ำ"];

describe("rasi content", () => {
  it("RULER covers 12 Thai signs", () => {
    expect(Object.keys(RULER)).toHaveLength(12);
    expect(RULER["เมษ"]).toBe("อังคาร");
    expect(RULER["มังกร"]).toBe("เสาร์");
  });
  it("RULER matches the traditional Thai/Vedic rulership for every sign", () => {
    // domicile rulers (สัตตเคราะห์เจ้าเรือน) — Sun/Moon rule one sign each, the
    // five remaining planets rule two signs each (no Uranus/Neptune/Pluto in Thai astro).
    const expected: Record<string, string> = {
      เมษ: "อังคาร", พฤษภ: "ศุกร์", เมถุน: "พุธ", กรกฎ: "จันทร์",
      สิงห์: "อาทิตย์", กันย์: "พุธ", ตุล: "ศุกร์", พิจิก: "อังคาร",
      ธนู: "พฤหัสบดี", มังกร: "เสาร์", กุมภ์: "เสาร์", มีน: "พฤหัสบดี",
    };
    RASI.forEach((r) => expect(RULER[r.s]).toBe(expected[r.s]));
  });
  it("every RASI sign has a RULER entry", () => {
    RASI.forEach((r) => expect(RULER[r.s]).toBeDefined());
  });
  it("RASI elements follow the standard triplicities", () => {
    const tri: Record<string, string> = {
      เมษ: "ไฟ", สิงห์: "ไฟ", ธนู: "ไฟ",
      พฤษภ: "ดิน", กันย์: "ดิน", มังกร: "ดิน",
      เมถุน: "ลม", ตุล: "ลม", กุมภ์: "ลม",
      กรกฎ: "น้ำ", พิจิก: "น้ำ", มีน: "น้ำ",
    };
    RASI.forEach((r) => expect(r.el).toBe(tri[r.s]));
  });
  it("EL_COMPAT pairs fire<->air, water<->earth", () => {
    expect(EL_COMPAT["ไฟ"]).toBe("ลม");
    expect(EL_COMPAT["ลม"]).toBe("ไฟ");
    expect(EL_COMPAT["น้ำ"]).toBe("ดิน");
    expect(EL_COMPAT["ดิน"]).toBe("น้ำ");
  });
  it("EL_CLASH pairs fire<->water, earth<->air and is symmetric & disjoint from compat", () => {
    expect(EL_CLASH["ไฟ"]).toBe("น้ำ");
    expect(EL_CLASH["น้ำ"]).toBe("ไฟ");
    expect(EL_CLASH["ดิน"]).toBe("ลม");
    expect(EL_CLASH["ลม"]).toBe("ดิน");
    ELEMENTS.forEach((e) => {
      expect(EL_CLASH[EL_CLASH[e]]).toBe(e); // symmetric
      expect(EL_CLASH[e]).not.toBe(EL_COMPAT[e]); // clash != compat
      expect(EL_CLASH[e]).not.toBe(e); // never self
    });
  });
  it("EL_LOVE has love+work for all 4 elements", () => {
    ELEMENTS.forEach((e) => {
      expect(typeof EL_LOVE[e].love).toBe("string");
      expect(typeof EL_LOVE[e].work).toBe("string");
    });
  });
  it("EL_NOTE has all 4 elements", () => {
    expect(Object.keys(EL_NOTE).sort()).toEqual(["ดิน", "น้ำ", "ลม", "ไฟ"]);
  });
  it("EL_SHORT has a non-empty phrase for all 4 elements", () => {
    ELEMENTS.forEach((e) => expect(EL_SHORT[e].length).toBeGreaterThan(0));
  });
  it("EL_GUIDE has strength/watch/advice for all 4 elements", () => {
    ELEMENTS.forEach((e) => {
      expect(EL_GUIDE[e].strength.length).toBeGreaterThan(0);
      expect(EL_GUIDE[e].watch.length).toBeGreaterThan(0);
      expect(EL_GUIDE[e].advice.length).toBeGreaterThan(0);
    });
  });
});
