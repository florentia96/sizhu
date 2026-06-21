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
  it("field ของคู่ (compat, partner) ไม่ดึงจาก profile", () => {
    expect(resolveCoreValue({ ...date("คู่ของคุณ — วันเกิด"), partner: true }, P)).toBeNull();
    expect(resolveCoreValue({ ...time("คู่ของคุณ — เวลาเกิด"), partner: true }, P)).toBeNull();
    expect(resolveCoreValue({ ...city("คู่ของคุณ — เมืองเกิด"), partner: true }, P)).toBeNull();
  });
  it("ฝั่งคุณ (compat) ยังดึงจาก profile", () => {
    expect(resolveCoreValue(date("คุณ — วันเกิด"), P)).toBe("2000-01-05");
    expect(resolveCoreValue(time("คุณ — เวลาเกิด"), P)).toBe("10:30");
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
  it("compat: ฝั่งคุณดึงครบ เหลือฝั่งคู่ (index 1,4,5)", () => {
    const compat: Field[] = [
      date("คุณ — วันเกิด"),
      { ...date("คู่ของคุณ — วันเกิด"), partner: true },
      time("คุณ — เวลาเกิด"),
      city("คุณ — เมืองเกิด"),
      { ...time("คู่ของคุณ — เวลาเกิด"), partner: true },
      { ...city("คู่ของคุณ — เมืองเกิด"), partner: true },
    ];
    expect(extraFieldIndexes(compat, P)).toEqual([1, 4, 5]);
  });
});

// กัน label drift: resolveCore จับคู่ด้วย substring ของ label ภาษาไทย (ยกเว้น field.partner) — ถ้าแก้ copy
// ของ label ในไฟล์ fields.ts ใด autofill one-tap ของ field นั้นจะพังเงียบ ๆ เทสต์นี้กวาดทุก feature จริงใน registry
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

  it("ไม่มี field วันเกิด/เวลา/เมือง/ปีเกิด/เพศ ของผู้ใช้หลงเหลือใน extra (ยกเว้นฝั่งคู่)", () => {
    const marker = /วันเกิด|ปีเกิด|เวลาเกิด|เมืองเกิด|เพศ/;
    for (const [id, def] of Object.entries(FEATURES)) {
      for (const i of extraFieldIndexes(def.fields, P)) {
        const f = def.fields[i];
        if (marker.test(f.label) && !f.partner) {
          throw new Error(`${id}: "${f.label}" ควร resolve จาก profile แต่ยังเป็น extra (อาจ label drift)`);
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
