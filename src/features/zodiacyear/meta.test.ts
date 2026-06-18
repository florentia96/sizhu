import { describe, it, expect } from "vitest";
import { meta, fields } from "./meta";

describe("zodiacyear meta", () => {
  it("declares id and cn", () => {
    expect(meta.id).toBe("zodiacyear");
    expect(meta.cn).toBe("生肖");
  });
  it("has a year field", () => {
    expect(fields.length).toBeGreaterThanOrEqual(1);
    expect(fields[0].type).toBe("text");
  });
});
