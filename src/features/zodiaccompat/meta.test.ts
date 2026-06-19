import { describe, it, expect } from "vitest";
import { meta, fields } from "./meta";
import type { Field } from "../../app/feature";

describe("zodiaccompat meta", () => {
  it("declares id and two select fields of 12 animals", () => {
    expect(meta.id).toBe("zodiaccompat");
    expect(meta.cn).toBe("合");
    expect(fields).toHaveLength(2);
    expect(fields[0].type).toBe("select");
    expect((fields[0] as Extract<Field, { type: "select" }>).options).toHaveLength(12);
    expect((fields[0] as Extract<Field, { type: "select" }>).options[0]).toBe("ชวด");
    expect((fields[1] as Extract<Field, { type: "select" }>).options[4]).toBe("มะโรง");
  });
});
