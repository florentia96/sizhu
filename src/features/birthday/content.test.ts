import { describe, it, expect } from "vitest";
import { EL_NOTE, LIFEPATH, PY_THEME, DAY_DETAIL, RULER } from "./content";

describe("birthday content", () => {
  it("EL_NOTE has all 4 Thai elements", () => {
    expect(Object.keys(EL_NOTE).sort()).toEqual(["ดิน", "น้ำ", "ลม", "ไฟ"]);
    expect(EL_NOTE["ไฟ"]).toContain("ธาตุไฟ");
  });
  it("LIFEPATH covers 1-9 plus master 11 and 22, each with k/d/guide", () => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22].forEach((n) => {
      expect(LIFEPATH[n]).toBeDefined();
      expect(typeof LIFEPATH[n].k).toBe("string");
      expect(typeof LIFEPATH[n].d).toBe("string");
      expect(typeof LIFEPATH[n].guide).toBe("string");
      expect(LIFEPATH[n].guide.length).toBeGreaterThan(0);
    });
    expect(LIFEPATH[1].k).toBe("ผู้นำ");
    expect(LIFEPATH[22].k).toContain("เลขพลังพิเศษ");
  });
  it("PY_THEME covers personal years 1-9", () => {
    for (let n = 1; n <= 9; n++) expect(typeof PY_THEME[n]).toBe("string");
    expect(PY_THEME[1]).toContain("เริ่มต้น");
  });
  it("DAY_DETAIL covers all 7 days + ราหู, each with strength/caution/career", () => {
    ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "ราหู"].forEach(
      (day) => {
        expect(DAY_DETAIL[day]).toBeDefined();
        expect(DAY_DETAIL[day].strength.length).toBeGreaterThan(0);
        expect(DAY_DETAIL[day].caution.length).toBeGreaterThan(0);
        expect(DAY_DETAIL[day].career.length).toBeGreaterThan(0);
      },
    );
  });
  it("RULER maps all 12 rasi to a ruling planet", () => {
    const rasi = [
      "เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์",
      "ตุล", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน",
    ];
    rasi.forEach((s) => expect(typeof RULER[s]).toBe("string"));
    expect(RULER["พฤษภ"]).toBe("ศุกร์");
    expect(RULER["เมษ"]).toBe("อังคาร");
  });
  it("copy is polite-neutral (no ครับ/ค่ะ particles)", () => {
    const blob = JSON.stringify({ EL_NOTE, LIFEPATH, PY_THEME, DAY_DETAIL });
    expect(blob).not.toMatch(/ครับ|ค่ะ|คะ/);
  });
});
