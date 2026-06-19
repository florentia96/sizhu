import { describe, it, expect } from "vitest";
import { dreamFeature } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("dream feature def", () => {
  it("meta + group + single textarea field", () => {
    expect(dreamFeature.meta.id).toBe("dream");
    expect(dreamFeature.group).toBe("daily");
    expect(dreamFeature.fields).toHaveLength(1);
    expect(dreamFeature.fields[0].type).toBe("textarea");
    expect(dreamFeature.fields[0].label).toBe("ข้อความฝัน");
  });
  it("build returns schema-valid sections for a matched dream", () => {
    const out = dreamFeature.engine.build(["ฝันเห็นงู"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
    expect(out.find((s) => s.kind === "cards")).toBeDefined();
  });
  it("build with empty text returns schema-valid prose+note", () => {
    const out = dreamFeature.engine.build([""]);
    expect(out[out.length - 1].kind).toBe("note");
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
  it("registered under daily", () => {
    expect(FEATURES["dream"]?.group).toBe("daily");
  });
});
