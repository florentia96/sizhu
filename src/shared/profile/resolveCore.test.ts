import { describe, it, expect } from "vitest";
import type { Field } from "../../app/feature";
import type { Profile } from "./profile";
import {
  resolveCoreValue,
  weekdayFromBirthDate,
  yearFromBirthDate,
  extraFieldIndexes,
  isCoreField,
  featureUsesCore,
} from "./resolveCore";
import { FEATURES } from "../../app/registry";

const P: Profile = {
  birthDate: "2000-01-05", // วันพุธ
  birthTime: "10:30",
  city: "กรุงเทพมหานคร|13.75|100.5|7",
  gender: "ชาย",
};

const date = (label: string): Field => ({ label, type: "date" });
const time = (label: string): Field => ({ label, type: "time" });
const text = (label: string): Field => ({ label, type: "text" });
const city = (label: string): Field => ({ label, type: "city" });
const sel = (label: string, options: string[]): Field => ({ label, type: "select", options });

describe("yearFromBirthDate", () => {
  it("ดึงปี ค.ศ. จาก YYYY-MM-DD", () => {
    expect(yearFromBirthDate("1992-05-15")).toBe("1992");
    expect(yearFromBirthDate("2000-01-05")).toBe("2000");
  });
  it("คืน null เมื่อรูปแบบผิด", () => {
    expect(yearFromBirthDate("")).toBeNull();
    expect(yearFromBirthDate("not-a-date")).toBeNull();
  });
});

describe("weekdayFromBirthDate", () => {
  it("คืนชื่อวันไทยตรงกับ option", () => {
    expect(weekdayFromBirthDate("2000-01-01")).toBe("เสาร์");
    expect(weekdayFromBirthDate("2000-01-02")).toBe("อาทิตย์");
    expect(weekdayFromBirthDate("2000-01-03")).toBe("จันทร์");
    expect(weekdayFromBirthDate("2000-01-04")).toBe("อังคาร");
    expect(weekdayFromBirthDate("2000-01-06")).toBe("พฤหัสบดี");
    expect(weekdayFromBirthDate("2000-01-07")).toBe("ศุกร์");
  });
  it("แยกพุธกลางวัน/กลางคืนที่ 18:00", () => {
    expect(weekdayFromBirthDate("2000-01-05", "10:30")).toBe("พุธ (กลางวัน)");
    expect(weekdayFromBirthDate("2000-01-05", "17:59")).toBe("พุธ (กลางวัน)");
    expect(weekdayFromBirthDate("2000-01-05", "18:00")).toBe("พุธ (กลางคืน)");
    expect(weekdayFromBirthDate("2000-01-05", "23:00")).toBe("พุธ (กลางคืน)");
  });
  it("ไม่ทราบเวลา → ถือเป็นพุธกลางวัน", () => {
    expect(weekdayFromBirthDate("2000-01-05")).toBe("พุธ (กลางวัน)");
  });
  it("รองรับ พ.ศ. (>2300) เป็น fallback", () => {
    expect(weekdayFromBirthDate("2543-01-01")).toBe("เสาร์"); // 2543 พ.ศ. = 2000 ค.ศ.
  });
});

describe("resolveCoreValue — แกนตรงตำแหน่ง", () => {
  it("วันเกิด/เวลาเกิด/เมือง/เพศ", () => {
    expect(resolveCoreValue(date("วันเกิด"), P)).toBe("2000-01-05");
    expect(resolveCoreValue(time("เวลาเกิด"), P)).toBe("10:30");
    expect(resolveCoreValue(city("เมืองเกิด"), P)).toBe(P.city);
    expect(resolveCoreValue(sel("เพศ", ["ชาย", "หญิง"]), P)).toBe("ชาย");
  });
  it("derive ปี (text ปีเกิด) และวัน (select วันเกิด)", () => {
    expect(resolveCoreValue(text("ปีเกิด (พ.ศ. หรือ ค.ศ.)"), P)).toBe("2000");
    expect(
      resolveCoreValue(sel("วันเกิด", ["อาทิตย์", "พุธ (กลางวัน)", "พุธ (กลางคืน)"]), P),
    ).toBe("พุธ (กลางวัน)");
  });
  it("field ของคนที่ 2 (compat) ไม่ดึงจาก profile", () => {
    expect(resolveCoreValue(date("คนที่ 2 — วันเกิด"), P)).toBeNull();
    expect(resolveCoreValue(time("คนที่ 2 — เวลาเกิด (ถ้ามี)"), P)).toBeNull();
    expect(resolveCoreValue(city("คนที่ 2 — เมืองเกิด (ถ้ามี)"), P)).toBeNull();
  });
  it("คนที่ 1 (compat) ยังดึงจาก profile", () => {
    expect(resolveCoreValue(date("คนที่ 1 — วันเกิด"), P)).toBe("2000-01-05");
    expect(resolveCoreValue(time("คนที่ 1 — เวลาเกิด (ถ้ามี)"), P)).toBe("10:30");
  });
  it("field ที่ไม่ใช่แกน → null", () => {
    expect(resolveCoreValue({ label: "ข้อความฝัน", type: "textarea" }, P)).toBeNull();
    expect(resolveCoreValue({ label: "เบอร์โทรศัพท์", type: "tel" }, P)).toBeNull();
    expect(resolveCoreValue(sel("ด้านที่อยากเสริม", ["การงาน"]), P)).toBeNull();
  });
  it("ไม่มีข้อมูลใน profile → null (จะถามในหน้า feature)", () => {
    const empty: Profile = {};
    expect(resolveCoreValue(date("วันเกิด"), empty)).toBeNull();
    expect(resolveCoreValue(city("เมืองเกิด"), empty)).toBeNull();
    expect(resolveCoreValue(text("ปีเกิด"), empty)).toBeNull();
    expect(resolveCoreValue(sel("วันเกิด", ["อาทิตย์"]), empty)).toBeNull();
  });
});

describe("extraFieldIndexes", () => {
  it("core-only (kua: ปีเกิด/เพศ/วันเกิด) → ไม่มี extra", () => {
    const kua: Field[] = [
      text("ปีเกิด (พ.ศ. หรือ ค.ศ.)"),
      sel("เพศ", ["ชาย", "หญิง"]),
      date("วันเกิด (ถ้าทราบ — ช่วยปรับรอบปีช่วงต้น ก.พ.)"),
    ];
    expect(extraFieldIndexes(kua, P)).toEqual([]);
  });
  it("luckycolor: วันเกิด(derive) + aspect(extra) → เหลือ index 1", () => {
    const lc: Field[] = [
      sel("วันเกิด", ["อาทิตย์", "พุธ (กลางวัน)"]),
      sel("ด้านที่อยากเสริม", ["การงาน", "การเงิน"]),
    ];
    expect(extraFieldIndexes(lc, P)).toEqual([1]);
  });
  it("compat: คนที่ 1 ดึงครบ เหลือคนที่ 2 (index 1,4,5)", () => {
    const compat: Field[] = [
      date("คนที่ 1 — วันเกิด"),
      date("คนที่ 2 — วันเกิด"),
      time("คนที่ 1 — เวลาเกิด (ถ้ามี)"),
      city("คนที่ 1 — เมืองเกิด (ถ้ามี)"),
      time("คนที่ 2 — เวลาเกิด (ถ้ามี)"),
      city("คนที่ 2 — เมืองเกิด (ถ้ามี)"),
    ];
    expect(extraFieldIndexes(compat, P)).toEqual([1, 4, 5]);
  });
});

// กัน label drift: resolveCore จับคู่ด้วย substring ของ label ภาษาไทย — ถ้าแก้ copy ของ label
// ในไฟล์ fields.ts ใด autofill one-tap ของ field นั้นจะพังเงียบ ๆ เทสต์นี้กวาดทุก feature จริงใน registry
describe("registry sweep — core fields ต้อง resolve จาก profile เต็ม", () => {
  const P: Profile = {
    birthDate: "2000-01-05",
    birthTime: "10:30",
    city: "กรุงเทพมหานคร|13.75|100.5|7",
    gender: "ชาย",
  };

  it("ทุก field ที่ isCoreField ต้อง resolve ได้ด้วย profile เต็ม", () => {
    for (const [id, def] of Object.entries(FEATURES)) {
      for (const f of def.fields) {
        if (isCoreField(f)) {
          expect(resolveCoreValue(f, P), `${id}: "${f.label}"`).not.toBeNull();
        }
      }
    }
  });

  it("ไม่มี field วันเกิด/เวลา/เมือง/ปีเกิด/เพศ หลงเหลือใน extra (ยกเว้นคนที่ 2)", () => {
    const marker = /วันเกิด|ปีเกิด|เวลาเกิด|เมืองเกิด|เพศ/;
    for (const [id, def] of Object.entries(FEATURES)) {
      const extra = extraFieldIndexes(def.fields, P).map((i) => def.fields[i].label);
      for (const lbl of extra) {
        if (marker.test(lbl) && !/ที่ 2/.test(lbl)) {
          throw new Error(`${id}: "${lbl}" ควร resolve จาก profile แต่ยังเป็น extra (อาจ label drift)`);
        }
      }
    }
  });

  it("kua resolve เป็น core-only + ฟีเจอร์โหราใช้ core data จริง", () => {
    expect(extraFieldIndexes(FEATURES["kua"].fields, P)).toEqual([]);
    for (const id of ["natal", "ascendant", "birthday", "kalakini", "namesuggest"]) {
      expect(featureUsesCore(FEATURES[id].fields), id).toBe(true);
    }
  });
});
