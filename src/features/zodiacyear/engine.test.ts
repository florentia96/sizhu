import { describe, it, expect } from "vitest";
import { engine, toCE, zodiacYearForCE } from "./engine";
import { ReportSchema } from "../../shared/sections/types";
import type { Section } from "../../shared/sections/types";

describe("zodiacyear engine", () => {
  it("toCE converts BE>2300 to CE, leaves CE alone", () => {
    expect(toCE("2535")).toBe(1992);
    expect(toCE("1992")).toBe(1992);
    expect(toCE("abc")).toBeNull();
  });
  it("1984 is Year of the Rat (reference vector)", () => {
    expect(zodiacYearForCE(1984)).toBe(0); // ชวด
  });
  it("1992 is Year of the Monkey, element น้ำ", () => {
    const out = engine.build(["2535"]);
    const head = out.find((s) => s.kind === "prose") as Extract<Section, { kind: "prose" }> | undefined;
    expect(head && head.title).toContain("วอก");
    expect(head && head.title).toContain("น้ำ");
  });
  it("output satisfies ReportSchema and is deterministic", () => {
    const a = engine.build(["2535"]);
    const b = engine.build(["2535"]);
    expect(ReportSchema.parse(a)).toBeTruthy();
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThanOrEqual(4);
  });
  it("empty year returns a note", () => {
    const out = engine.build([""]);
    expect(out[0].kind).toBe("note");
  });
});
