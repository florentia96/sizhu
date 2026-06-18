import { describe, it, expect } from "vitest";
import { meta } from "./meta";
import { fields } from "./fields";
import { PHOP_NAMES, BASE_MEANINGS, NUM_MEANING } from "./content";

describe("num7 data layer", () => {
  it("meta has required FeatureMeta keys", () => {
    expect(meta.id).toBe("num7");
    expect(meta.cn).toBe("局");
    expect(meta.name.length).toBeGreaterThan(0);
    expect(meta.long.length).toBeGreaterThan(20);
  });
  it("fields = single date field 'วันเกิด'", () => {
    expect(fields).toEqual([{ label: "วันเกิด", type: "date" }]);
  });
  it("PHOP_NAMES has 3 rows of exactly 7 ภพ each", () => {
    expect(PHOP_NAMES).toHaveLength(3);
    for (const row of PHOP_NAMES) expect(row).toHaveLength(7);
    expect(PHOP_NAMES[0][0]).toBe("อัตตะ");
    expect(PHOP_NAMES[2][6]).toBe("ทาสา");
  });
  it("BASE_MEANINGS labels rows 1..7 (ฐานบน/กลาง/ล่าง + derived)", () => {
    expect(Object.keys(BASE_MEANINGS)).toHaveLength(7);
    expect(BASE_MEANINGS[1]).toContain("ฐานบน");
    expect(BASE_MEANINGS[2]).toContain("ฐานกลาง");
    expect(BASE_MEANINGS[3]).toContain("ฐานล่าง");
  });
  it("NUM_MEANING covers digits 1..7", () => {
    for (let n = 1; n <= 7; n++) expect(NUM_MEANING[n].length).toBeGreaterThan(0);
  });
});
