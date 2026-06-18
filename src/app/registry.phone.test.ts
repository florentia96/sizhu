import { describe, it, expect } from "vitest";
import { FEATURES } from "./registry";
import { ReportSchema } from "../shared/sections/types";

describe("phone registry entry", () => {
  it("is registered under id 'phone' in group 'numbers'", () => {
    const def = FEATURES["phone"];
    expect(def).toBeDefined();
    expect(def.meta.id).toBe("phone");
    expect(def.group).toBe("numbers");
    expect(def.fullRoute).toBeUndefined();
  });

  it("wires fields and a working engine", () => {
    const def = FEATURES["phone"];
    expect(def.fields).toHaveLength(1);
    expect(def.fields[0].type).toBe("tel");
    const report = def.engine.build(["0812345678"]);
    expect(() => ReportSchema.parse(report)).not.toThrow();
  });

  it("vals index aligns with fields index (vals[0] -> the tel field)", () => {
    const def = FEATURES["phone"];
    expect(def.fields.length).toBe(1);
    const r = def.engine.build(["1"]);
    expect(r[0].kind).toBe("note");
  });
});
