import { describe, it, expect } from "vitest";
import { baziFeature } from "../src/features/bazi";
import { FEATURES } from "../src/app/registry";
import { ReportSchema } from "../src/shared/sections/types";

describe("feature: bazi (fullRoute teaser)", () => {
  it("meta shape: id/cn/group/fullRoute", () => {
    expect(baziFeature.meta.id).toBe("bazi");
    expect(baziFeature.meta.cn).toBe("八");
    expect(baziFeature.group).toBe("chinese");
    expect(baziFeature.fullRoute).toBe(true);
    expect(baziFeature.fields).toEqual([]);
    expect(baziFeature.meta.name.length).toBeGreaterThan(0);
    expect(baziFeature.meta.desc.length).toBeGreaterThan(0);
    expect(baziFeature.meta.long.length).toBeGreaterThan(0);
  });

  it("teaser engine returns schema-valid Section[] (a single note)", () => {
    const out = baziFeature.engine.build([]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
    expect(out[0].kind).toBe("note");
  });

  it("determinism: same (empty) input → identical output", () => {
    expect(baziFeature.engine.build([])).toEqual(baziFeature.engine.build([]));
  });

  it("registered in FEATURES under 'bazi' with fullRoute true", () => {
    expect(FEATURES.bazi).toBeDefined();
    expect(FEATURES.bazi.fullRoute).toBe(true);
    expect(FEATURES.bazi.group).toBe("chinese");
  });
});
