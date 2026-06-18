import { describe, it, expect } from "vitest";
import { meta, fields } from "./meta";
import type { Field } from "../../app/feature";
import { KUA_DIR, GOOD_NAME, BAD_NAME, DIR_TH } from "./content";

describe("kua meta", () => {
  it("declares id, year + gender + date fields", () => {
    expect(meta.id).toBe("kua");
    expect(meta.cn).toBe("卦");
    expect(fields).toHaveLength(3);
    expect(fields[0].type).toBe("text");
    expect(fields[1].type).toBe("select");
    expect((fields[1] as Extract<Field, { type: "select" }>).options).toEqual(["ชาย", "หญิง"]);
    expect(fields[2].type).toBe("date");
  });
  it("KUA_DIR covers 1-4,6-9 with 8 directions each", () => {
    for (const k of [1, 2, 3, 4, 6, 7, 8, 9]) {
      expect(KUA_DIR[k]).toHaveLength(8);
    }
    expect(KUA_DIR[5]).toBeUndefined();
    expect(KUA_DIR[1][0]).toBe("SE");
  });
  it("GOOD_NAME/BAD_NAME have 4 entries each", () => {
    expect(GOOD_NAME).toHaveLength(4);
    expect(BAD_NAME).toHaveLength(4);
    expect(GOOD_NAME[0].cn).toBe("生氣");
    expect(BAD_NAME[3].cn).toBe("絕命");
    expect(DIR_TH.SE).toBe("ตะวันออกเฉียงใต้");
  });
});
