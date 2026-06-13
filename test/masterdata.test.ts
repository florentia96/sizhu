import { describe, it, expect } from "vitest";
import { HIDDEN, XING } from "../src/engine/constants";
import { relation } from "../src/engine/bazi";
import { changSheng, naYin, voidBranches } from "../src/engine/almanac";
import type { Zhi } from "../src/types";

// ล็อก master data ให้ตรงตำรา (子平 / 三命通會) — กันการแก้พลาดเงียบ ๆ
describe("master data — 藏干 中氣 = ก้าน長生ของ三合 (ใช้กฎเดียวกันทุกเสา)", () => {
  it("巳 = 丙庚戊 (中氣 庚 ตาม 巳酉丑金局 ไม่ใช่ 火土同宮)", () => {
    expect(HIDDEN["巳"]).toEqual(["丙", "庚", "戊"]);
  });
  it("เสาอื่นที่มีก้านซ่อน 3 ตัวยังตรง", () => {
    expect(HIDDEN["寅"]).toEqual(["甲", "丙", "戊"]); // 寅午戌火 → 中丙
    expect(HIDDEN["申"]).toEqual(["庚", "壬", "戊"]); // 申子辰水 → 中壬
    expect(HIDDEN["亥"]).toEqual(["壬", "甲"]); // 亥卯未木 → 中甲
  });
});

describe("master data — 刑 ครบชุดตามตำรา", () => {
  const hasXing = (a: Zhi, b: Zhi): boolean => relation(a, b).includes("เฮ่ง");
  it("三刑 寅巳申", () => {
    expect(hasXing("寅", "巳")).toBe(true);
    expect(hasXing("巳", "申")).toBe(true);
    expect(hasXing("申", "寅")).toBe(true);
  });
  it("三刑 丑戌未", () => {
    expect(hasXing("丑", "戌")).toBe(true);
    expect(hasXing("戌", "未")).toBe(true);
    expect(hasXing("未", "丑")).toBe(true);
  });
  it("互刑 子卯", () => {
    expect(hasXing("子", "卯")).toBe(true);
  });
  it("自刑 辰午酉亥 (ธาตุเดียวกันซ้ำสองเสา)", () => {
    expect(hasXing("辰", "辰")).toBe(true);
    expect(hasXing("午", "午")).toBe(true);
    expect(hasXing("酉", "酉")).toBe(true);
    expect(hasXing("亥", "亥")).toBe(true);
  });
  it("คู่ที่ไม่ใช่ 刑 ต้องไม่ติด", () => {
    expect(hasXing("子", "丑")).toBe(false); // 六合
    expect(hasXing("寅", "卯")).toBe(false);
  });
  it("XING รวม 11 คู่", () => {
    expect(XING).toHaveLength(11);
  });
});

describe("master data — 納音 (เทียบตาราง 60 甲子)", () => {
  it("คู่หัว/ท้าย/กลางตรงตำรา", () => {
    expect(naYin("甲", "子").cn).toBe("海中金");
    expect(naYin("甲", "子").el).toBe("ทอง");
    expect(naYin("乙", "丑").cn).toBe("海中金"); // คู่เดียวกับ 甲子
    expect(naYin("甲", "寅").cn).toBe("大溪水");
    expect(naYin("癸", "亥").cn).toBe("大海水");
  });
});

describe("master data — 十二長生 (หยาง順 / ยิน逆)", () => {
  it("甲 (หยาง): 長生 ที่ 亥, 帝旺 ที่ 卯", () => {
    expect(changSheng("甲", "亥")).toContain("長生");
    expect(changSheng("甲", "卯")).toContain("帝旺");
  });
  it("乙 (ยิน): 長生 ที่ 午, 帝旺 ที่ 寅", () => {
    expect(changSheng("乙", "午")).toContain("長生");
    expect(changSheng("乙", "寅")).toContain("帝旺");
  });
});

describe("master data — 空亡 (旬空 อิงเสาวัน)", () => {
  it("甲子日 → ว่าง 戌亥 · 甲戌日 → ว่าง 申酉", () => {
    expect(voidBranches("甲", "子")).toEqual(["戌", "亥"]);
    expect(voidBranches("甲", "戌")).toEqual(["申", "酉"]);
  });
  it("庚午日 (อยู่ 甲子旬) → ว่าง 戌亥", () => {
    expect(voidBranches("庚", "午")).toEqual(["戌", "亥"]);
  });
});
