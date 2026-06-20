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
  it("plate field has plate-shaped input guards (maxLength 8, text inputMode, hint)", () => {
    const f = licenseFields[0];
    expect(f.type).toBe("text");
    if (f.type === "text") {
      expect(f.maxLength).toBe(8);
      // plates contain Thai letters → must NOT be numeric
      expect(f.inputMode).toBe("text");
      expect(f.placeholder).toBe("1กก2345");
      expect(f.hint).toBeTruthy();
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

describe("license enriched result", () => {
  it("emits a per-letter rows breakdown (each plate consonant + its value)", () => {
    const out = licenseEngine.build(["1กก2345", "ภูเก็ต"]);
    const rows = out.find(
      (s) => s.kind === "rows" && s.title.includes("ค่าพยัญชนะบนป้าย"),
    );
    expect(rows).toBeDefined();
    if (rows && rows.kind === "rows") {
      expect(rows.items).toHaveLength(2);
      expect(rows.items.every((i) => i.n === "ก" && i.title.includes("1"))).toBe(true);
    }
  });

  it("includes a license-specific guidance prose tying letters + digits together", () => {
    const out = licenseEngine.build(["1กก2345", "เชียงใหม่"]);
    const prose = out.find((s) => s.kind === "prose" && s.title === "อ่านป้ายทะเบียนนี้");
    expect(prose).toBeDefined();
    if (prose && prose.kind === "prose") {
      const joined = prose.paras.map((p) => p.t).join(" ");
      // mentions both the combined-sum derivation and that หมวดอักษร carries no direct meaning
      expect(joined.includes("ผลรวมรวม")).toBe(true);
      expect(joined.includes("หมวดอักษร")).toBe(true);
    }
  });

  it("output still satisfies ReportSchema after enrichment", () => {
    expect(() => ReportSchema.parse(licenseEngine.build(["1กก2345", "ชลบุรี"]))).not.toThrow();
  });

  it("verdict stays first, source note stays last (splice order preserved)", () => {
    const out = licenseEngine.build(["1กก2345", "ชลบุรี"]);
    expect(out[0].kind).toBe("verdict");
    expect(out[out.length - 1].kind).toBe("note");
  });

  it("plate with no table consonants still produces a grid + guidance (no crash)", () => {
    const out = licenseEngine.build(["1234", "ชลบุรี"]);
    const grid = out.find((s) => s.kind === "grid" && s.title.includes("ผลรวมรวม"));
    expect(grid).toBeDefined();
    const prose = out.find((s) => s.kind === "prose" && s.title === "อ่านป้ายทะเบียนนี้");
    expect(prose).toBeDefined();
    // no per-letter rows when there are no table consonants
    const letterRows = out.find(
      (s) => s.kind === "rows" && s.title.includes("ค่าพยัญชนะบนป้าย"),
    );
    expect(letterRows).toBeUndefined();
  });
});
