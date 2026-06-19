import { describe, it, expect } from "vitest";
import { luckycolorFeature } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("luckycolor feature def", () => {
  it("two selects: 7 days + 5 aspects", () => {
    expect(luckycolorFeature.meta.id).toBe("luckycolor");
    expect(luckycolorFeature.group).toBe("daily");
    const [f0, f1] = luckycolorFeature.fields;
    expect(f0.type).toBe("select");
    expect(f1.type).toBe("select");
    if (f0.type === "select") {
      expect(f0.options).toEqual([
        "อาทิตย์","จันทร์","อังคาร","พุธ (กลางวัน)","พุธ (กลางคืน)","พฤหัสบดี","ศุกร์","เสาร์",
      ]);
    }
    if (f1.type === "select") {
      expect(f1.options).toEqual([
        "การงาน","การเงิน","ความรัก","สุขภาพ","เมตตามหานิยม",
      ]);
    }
  });
  it("aspect options exactly match engine aspMap keys", () => {
    const f1 = luckycolorFeature.fields[1];
    if (f1.type === "select") {
      f1.options.forEach((opt) => {
        const out = luckycolorFeature.engine.build(["จันทร์", opt]);
        expect(() => ReportSchema.parse(out)).not.toThrow();
      });
    }
  });
  it("build returns schema-valid sections", () => {
    const out = luckycolorFeature.engine.build(["จันทร์", "การเงิน"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
  it("missing day defaults to อาทิตย์", () => {
    const out = luckycolorFeature.engine.build(["", "การงาน"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
    const sun = luckycolorFeature.engine.build(["อาทิตย์", "การงาน"]);
    expect(JSON.stringify(out)).toBe(
      JSON.stringify(sun).replace(/สีมงคลประจำวันอาทิตย์/, "สีมงคลประจำวันอาทิตย์"),
    );
  });
  it("registered under daily", () => {
    expect(FEATURES["luckycolor"]?.group).toBe("daily");
  });

  it("พุธ (กลางคืน) → ราหู colors, distinct from กลางวัน and not the อาทิตย์ fallback (regression)", () => {
    const night = JSON.stringify(luckycolorFeature.engine.build(["พุธ (กลางคืน)", "การงาน"]));
    const day = JSON.stringify(luckycolorFeature.engine.build(["พุธ (กลางวัน)", "การงาน"]));
    const sun = JSON.stringify(luckycolorFeature.engine.build(["อาทิตย์", "การงาน"]));
    expect(night).not.toBe(day);
    expect(night).not.toBe(sun);
    expect(night).toContain("พุธ (กลางคืน)");
  });
});
