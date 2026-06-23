import { describe, it, expect } from "vitest";
import { taksaForDay, letterBucketMap, WHEEL, BHUMI } from "./taksa";

describe("taksaForDay — wheel rotation", () => {
  it("returns 8 bhumi cells, [0]=บริวาร … [7]=กาลกิณี", () => {
    const t = taksaForDay("อาทิตย์");
    expect(t).toHaveLength(8);
    expect(t[0].bhumi).toBe("บริวาร");
    expect(t[7].bhumi).toBe("กาลกิณี");
  });

  it("Sunday-born: กาลกิณี falls on ศุกร์ (wheel start=0, [7] → WHEEL[7])", () => {
    const t = taksaForDay("อาทิตย์");
    expect(t[7].bhumi).toBe("กาลกิณี");
    expect(t[7].planet).toBe("ศุกร์");
    expect(t[0].planet).toBe("อาทิตย์");
  });

  it("Monday-born: บริวาร starts on จันทร์ (rotation actually shifts)", () => {
    const t = taksaForDay("จันทร์");
    expect(t[0].planet).toBe("จันทร์");
    expect(t[0].bhumi).toBe("บริวาร");
    expect(t[7].bhumi).toBe("กาลกิณี");
  });

  it("พุธ (กลางคืน) and ราหู share the ราหู wheel base (index 6)", () => {
    expect(taksaForDay("พุธ (กลางคืน)")[0].planet).toBe("ราหู");
    expect(taksaForDay("ราหู")[0].planet).toBe("ราหู");
  });

  it("unknown day label falls back to start=0 (อาทิตย์)", () => {
    expect(taksaForDay("ไม่มีจริง")[0].planet).toBe("อาทิตย์");
  });

  it("tone of กาลกิณี cell is bad; เดช/ศรี are good", () => {
    const t = taksaForDay("อาทิตย์");
    expect(t[7].k).toBe("bad");
    expect(t[2].k).toBe("good"); // decha
    expect(t[3].k).toBe("good"); // sri
  });

  it("returns copies of letters (mutating result does not corrupt WHEEL)", () => {
    const t = taksaForDay("อาทิตย์");
    t[0].letters.push("X");
    expect(WHEEL[0].letters).not.toContain("X");
  });
});

describe("letterBucketMap", () => {
  it("maps every letter of the wheel to its bhumi+tone for the given day", () => {
    const m = letterBucketMap("อาทิตย์");
    expect(m["ศ"].bhumi).toBe("กาลกิณี"); // the letter "so" is in WHEEL[7]=Venus -> kalakini for Sunday
    expect(m["ศ"].k).toBe("bad");
    expect(m["ก"].bhumi).toBe("อายุ");   // the letter "ko" is in WHEEL[1]=Moon -> [1]=ayu for Sunday
  });

  it("covers all letters of all 8 planets (no letter unmapped)", () => {
    const m = letterBucketMap("อาทิตย์");
    const total = WHEEL.reduce((n, w) => n + w.letters.length, 0);
    expect(Object.keys(m)).toHaveLength(total);
    expect(BHUMI).toHaveLength(8);
  });
});
