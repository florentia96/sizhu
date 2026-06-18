import { describe, it, expect } from "vitest";
import { rasiFeature } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("rasi feature def", () => {
  it("meta + group + single date field", () => {
    expect(rasiFeature.meta.id).toBe("rasi");
    expect(rasiFeature.group).toBe("daily");
    expect(rasiFeature.fields).toHaveLength(1);
    expect(rasiFeature.fields[0].type).toBe("date");
    expect(rasiFeature.fields[0].label).toBe("วันเกิด");
  });
  it("build returns schema-valid sections", () => {
    const out = rasiFeature.engine.build(["1990-05-15"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
    expect(out.length).toBeGreaterThan(1);
  });
  it("empty input returns schema-valid note", () => {
    const out = rasiFeature.engine.build([""]);
    expect(out[0].kind).toBe("note");
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
  it("is registered under daily", () => {
    expect(FEATURES["rasi"]?.group).toBe("daily");
  });
});
