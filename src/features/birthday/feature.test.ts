import { describe, it, expect } from "vitest";
import { birthdayFeature } from "./index";
import { FEATURES } from "../../app/registry";
import { ReportSchema } from "../../shared/sections/types";

describe("birthday feature def", () => {
  it("meta + group + single date field", () => {
    expect(birthdayFeature.meta.id).toBe("birthday");
    expect(birthdayFeature.group).toBe("daily");
    expect(birthdayFeature.fields).toHaveLength(1);
    expect(birthdayFeature.fields[0].type).toBe("date");
    expect(birthdayFeature.fields[0].label).toBe("วันเกิด");
  });
  it("build parses date and returns schema-valid sections", () => {
    const out = birthdayFeature.engine.build(["1990-05-15"]);
    expect(() => ReportSchema.parse(out)).not.toThrow();
    expect(out.length).toBeGreaterThan(1);
  });
  it("build with empty input returns a schema-valid note", () => {
    const out = birthdayFeature.engine.build([""]);
    expect(out[0].kind).toBe("note");
    expect(() => ReportSchema.parse(out)).not.toThrow();
  });
  it("is registered under daily", () => {
    expect(FEATURES["birthday"]?.group).toBe("daily");
  });
});
