import { describe, it, expect } from "vitest";
import { meta } from "./meta";
import { fields } from "./fields";
import { PHOP_NAMES, PHOP_MEANING, BASE_MEANINGS, NUM_MEANING, HOW_TO_READ } from "./content";

describe("num7 data layer", () => {
  it("meta has required FeatureMeta keys", () => {
    expect(meta.id).toBe("num7");
    expect(meta.cn).toBe("局");
    expect(meta.name.length).toBeGreaterThan(0);
    expect(meta.long.length).toBeGreaterThan(20);
  });
  it("fields = single date field labelled 'วันเกิด' (type date, for core resolver)", () => {
    expect(fields).toHaveLength(1);
    expect(fields[0].label).toBe("วันเกิด");
    expect(fields[0].type).toBe("date");
    expect(fields[0].hint && fields[0].hint.length).toBeGreaterThan(0);
  });
  it("PHOP_NAMES has 3 rows of exactly 7 ภพ each", () => {
    expect(PHOP_NAMES).toHaveLength(3);
    for (const row of PHOP_NAMES) expect(row).toHaveLength(7);
    expect(PHOP_NAMES[0][0]).toBe("อัตตะ");
    expect(PHOP_NAMES[2][6]).toBe("ทาสา");
  });
  it("PHOP_MEANING covers all 21 ภพ with non-empty text", () => {
    const names = PHOP_NAMES.flat();
    expect(names).toHaveLength(21);
    for (const n of names) {
      expect(PHOP_MEANING[n]).toBeTruthy();
      expect(PHOP_MEANING[n].length).toBeGreaterThan(5);
    }
  });
  it("BASE_MEANINGS labels rows 1..7 (ฐานบน/กลาง/ล่าง + derived)", () => {
    expect(Object.keys(BASE_MEANINGS)).toHaveLength(7);
    expect(BASE_MEANINGS[1]).toContain("ฐานบน");
    expect(BASE_MEANINGS[2]).toContain("ฐานกลาง");
    expect(BASE_MEANINGS[3]).toContain("ฐานล่าง");
    expect(BASE_MEANINGS[3]).toContain("นักษัตร"); // the lower base comes from the zodiac year
  });
  it("NUM_MEANING covers digits 1..7 mapped to ดาวพระเคราะห์", () => {
    const planets = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
    for (let n = 1; n <= 7; n++) {
      expect(NUM_MEANING[n].length).toBeGreaterThan(0);
      expect(NUM_MEANING[n]).toContain(planets[n - 1]);
    }
  });
  it("HOW_TO_READ explains reading from ฐานบน first + ดาว×ภพ", () => {
    expect(HOW_TO_READ).toContain("ฐานบน");
    expect(HOW_TO_READ.length).toBeGreaterThan(40);
  });
  it("no gendered/slang particles in content strings (polite-neutral)", () => {
    // anchor to sentence-enders so words like "chao chata"/"khanaen" do not false-positive
    const PARTICLES = /(ครับ|ค่ะ|คะ|นะคะ|จ้า|จ้ะ|ฮะ|ฮ่ะ)(?=["'\s.,!?)]|$)/;
    const blob = JSON.stringify({ PHOP_MEANING, BASE_MEANINGS, NUM_MEANING, HOW_TO_READ, meta });
    expect(blob).not.toMatch(PARTICLES);
  });
});
