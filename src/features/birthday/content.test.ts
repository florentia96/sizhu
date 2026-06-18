import { describe, it, expect } from "vitest";
import { EL_NOTE, LIFEPATH, PY_THEME } from "./content";

describe("birthday content", () => {
  it("EL_NOTE has all 4 Thai elements", () => {
    expect(Object.keys(EL_NOTE).sort()).toEqual(["ดิน", "น้ำ", "ลม", "ไฟ"]);
    expect(EL_NOTE["ไฟ"]).toContain("ธาตุไฟ");
  });
  it("LIFEPATH covers 1-9 plus master 11 and 22", () => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22].forEach((n) => {
      expect(LIFEPATH[n]).toBeDefined();
      expect(typeof LIFEPATH[n].k).toBe("string");
      expect(typeof LIFEPATH[n].d).toBe("string");
    });
    expect(LIFEPATH[1].k).toBe("ผู้นำ");
    expect(LIFEPATH[22].k).toContain("เลขมาสเตอร์");
  });
  it("PY_THEME covers personal years 1-9", () => {
    for (let n = 1; n <= 9; n++) expect(typeof PY_THEME[n]).toBe("string");
    expect(PY_THEME[1]).toContain("เริ่มต้น");
  });
});
