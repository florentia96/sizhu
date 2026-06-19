import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  Field,
  GroupId,
  FeatureMeta,
  FeatureEngine,
  FeatureDef,
} from "./feature";
import type { Section } from "../shared/sections/types";

describe("feature.ts — central feature types", () => {
  it("Field variants accept each declared type", () => {
    const text: Field = { label: "เบอร์", type: "tel", placeholder: "08X" };
    const sel: Field = { label: "จังหวัด", type: "select", options: ["กรุงเทพ"] };
    const area: Field = { label: "ฝัน", type: "textarea", placeholder: "เล่าฝัน" };
    const city: Field = { label: "เมืองเกิด", type: "city" };
    expect(text.type).toBe("tel");
    expect(sel.type).toBe("select");
    expect(area.type).toBe("textarea");
    expect(city.type).toBe("city");
  });

  it("GroupId is the closed set of 5 groups", () => {
    const groups: GroupId[] = ["numbers", "names", "astro", "chinese", "daily"];
    expect(groups).toHaveLength(5);
  });

  it("FeatureEngine.build returns Section[] from vals: string[]", () => {
    const engine: FeatureEngine = {
      build(vals: string[]): Section[] {
        return [{ kind: "note", text: vals.join(",") }];
      },
    };
    const out = engine.build(["a", "b"]);
    expect(out[0]).toEqual({ kind: "note", text: "a,b" });
    expectTypeOf(engine.build).parameters.toEqualTypeOf<[string[]]>();
    expectTypeOf(engine.build).returns.toEqualTypeOf<Section[]>();
  });

  it("FeatureDef ties meta/group/fields/engine and allows optional fullRoute", () => {
    const meta: FeatureMeta = {
      id: "phone",
      name: "วิเคราะห์เบอร์",
      cn: "號",
      desc: "เบอร์ → เกรด",
      long: "วิเคราะห์เบอร์โทรเชิงเลขศาสตร์",
    };
    const def: FeatureDef = {
      meta,
      group: "numbers",
      fields: [{ label: "เบอร์", type: "tel" }],
      engine: { build: () => [{ kind: "note", text: "ok" }] },
      fullRoute: true,
    };
    expect(def.group).toBe("numbers");
    expect(def.fullRoute).toBe(true);
    expect(def.meta.id).toBe("phone");
  });
});
