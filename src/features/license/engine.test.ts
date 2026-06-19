import { describe, it, expect } from "vitest";
import { licenseMeta } from "./meta";
import { licenseFields } from "./fields";
import { licenseEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

const PROVINCES = ["กรุงเทพมหานคร", "เชียงใหม่", "ชลบุรี", "ภูเก็ต", "นครราชสีมา"];

describe("license meta + fields", () => {
  it("meta id is license", () => {
    expect(licenseMeta.id).toBe("license");
    expect(licenseMeta.long).toBeTruthy();
  });
  it("fields = [ทะเบียน(text), จังหวัด(select)] in order", () => {
    expect(licenseFields).toHaveLength(2);
    expect(licenseFields[0].type).toBe("text");
    expect(licenseFields[0].label).toBe("ทะเบียน");
    const provField = licenseFields[1];
    expect(provField.type).toBe("select");
    if (provField.type === "select") {
      PROVINCES.forEach((p) => expect(provField.options).toContain(p));
    }
  });
});

describe("license engine", () => {
  it("output satisfies ReportSchema", () => {
    expect(() => ReportSchema.parse(licenseEngine.build(["1กก234", "กรุงเทพมหานคร"]))).not.toThrow();
  });
  it("is deterministic", () => {
    const a = licenseEngine.build(["1กก234", "ชลบุรี"]);
    const b = licenseEngine.build(["1กก234", "ชลบุรี"]);
    expect(a).toEqual(b);
  });
  it("analyses the plate DIGITS (verdict present) for 1กก234", () => {
    const out = licenseEngine.build(["1กก234", "ภูเก็ต"]);
    const v = out.find((s) => s.kind === "verdict");
    expect(v && v.kind === "verdict" && v.score >= 22 && v.score <= 98).toBe(true);
  });
  it("includes a letter-value note before the trailing source note", () => {
    const out = licenseEngine.build(["1กก234", "เชียงใหม่"]);
    const noteTexts = out.filter((s) => s.kind === "note").map((s) => (s.kind === "note" ? s.text : ""));
    expect(noteTexts.some((t) => t.includes("ค่าตัวอักษร"))).toBe(true);
  });
  it("short plate -> single note", () => {
    expect(licenseEngine.build(["ก", "ภูเก็ต"])).toEqual([
      { kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" },
    ]);
  });
});

describe("license deepened engine", () => {
  it("note now references the cited convention (ก=1)", () => {
    const out = licenseEngine.build(["1กก234", "ภูเก็ต"]);
    const notes = out.filter((s) => s.kind === "note").map((s) => (s.kind === "note" ? s.text : ""));
    expect(notes.some((t) => t.includes("ก=1"))).toBe(true);
  });
  it("emits a grid carrying combinedSum 12 for 1กก234", () => {
    const out = licenseEngine.build(["1กก234", "ภูเก็ต"]);
    const grid = out.find((s) => s.kind === "grid" && s.title.includes("ผลรวมรวม"));
    expect(grid).toBeDefined();
    if (grid && grid.kind === "grid") {
      const cell = grid.cells.find((x) => x.name === "ผลรวมรวม");
      expect(cell?.value).toBe("12");
    }
  });
  it("is deterministic after deepening", () => {
    expect(licenseEngine.build(["1กก234", "ชลบุรี"])).toEqual(licenseEngine.build(["1กก234", "ชลบุรี"]));
  });
});
