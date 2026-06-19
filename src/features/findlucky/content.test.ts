import { describe, it, expect } from "vitest";
import { findluckyMeta } from "./meta";
import { findluckyFields } from "./fields";
import { GOOD_PAIRS, LEVEL_THRESHOLD, PAGE_SIZE } from "./content";

describe("findlucky meta + fields", () => {
  it("meta id is findlucky", () => {
    expect(findluckyMeta.id).toBe("findlucky");
    expect(findluckyMeta.long).toBeTruthy();
  });
  it("fields = [ประเภท(select), เลขที่อยากมี(text), ระดับ(select)] in order", () => {
    expect(findluckyFields).toHaveLength(3);
    expect(findluckyFields[0].type).toBe("select");
    if (findluckyFields[0].type === "select") {
      expect(findluckyFields[0].options).toEqual(["เบอร์โทรศัพท์", "ทะเบียนรถ"]);
    }
    expect(findluckyFields[1].type).toBe("text");
    expect(findluckyFields[2].type).toBe("select");
    if (findluckyFields[2].type === "select") {
      expect(findluckyFields[2].options).toEqual(["มาตรฐาน", "พรีเมียม"]);
    }
  });
});

describe("findlucky content constants", () => {
  it("GOOD_PAIRS is a fixed-order non-empty array of 2-digit strings", () => {
    expect(GOOD_PAIRS.length).toBeGreaterThan(20);
    GOOD_PAIRS.forEach((p) => expect(p).toMatch(/^\d{2}$/));
  });
  it("GOOD_PAIRS has stable, deduped order (no duplicates)", () => {
    expect(new Set(GOOD_PAIRS).size).toBe(GOOD_PAIRS.length);
  });
  it("GOOD_PAIRS first three entries are exactly the ported order", () => {
    expect(GOOD_PAIRS.slice(0, 3)).toEqual(["14", "41", "15"]);
  });
  it("level thresholds and page size", () => {
    expect(LEVEL_THRESHOLD["มาตรฐาน"]).toBe(78);
    expect(LEVEL_THRESHOLD["พรีเมียม"]).toBe(86);
    expect(PAGE_SIZE).toBe(6);
  });
});
