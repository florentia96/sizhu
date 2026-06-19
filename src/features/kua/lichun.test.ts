import { describe, it, expect } from "vitest";
import { engine, kuaNumber } from "./engine";
import type { Section } from "../../shared/sections/types";

describe("kua 立春 boundary", () => {
  it("1984-01-20 male resolves to 1983 -> kua of 1983, not 1984", () => {
    const out = engine.build(["2527", "ชาย", "1984-01-20"]);
    const v = out[0] as Extract<Section, { kind: "verdict" }>;
    expect(v.grade).toBe("กัว " + kuaNumber(1983, "ชาย"));
    expect(v.grade).toBe("กัว 8"); // 1983 ชาย: 83→8+3=11→2, 10-2=8
  });
  it("1984-03-01 male stays 1984 -> kua 7", () => {
    const out = engine.build(["2527", "ชาย", "1984-03-01"]);
    expect((out[0] as Extract<Section, { kind: "verdict" }>).grade).toBe("กัว 7");
  });
  it("no date falls back to year input", () => {
    const out = engine.build(["2527", "ชาย"]);
    expect((out[0] as Extract<Section, { kind: "verdict" }>).grade).toBe("กัว 7"); // 1984 male
  });
});
