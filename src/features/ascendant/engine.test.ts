import { describe, it, expect } from "vitest";
import { ascEngine } from "./engine";
import { ReportSchema } from "../../shared/sections/types";

const VALS = ["1990-01-15", "14:30", "กรุงเทพมหานคร"];

describe("ascendant engine", () => {
  it("schema-valid + deterministic", () => {
    const r = ascEngine.build(VALS);
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(ascEngine.build(VALS)).toEqual(ascEngine.build(VALS));
  });

  it("grid has Asc, Sun rasi, Moon rasi, MC, Thai lagna", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    expect(grid).toBeTruthy();
    if (grid && grid.kind === "grid") {
      const names = grid.cells.map((c) => c.name).join("|");
      expect(names).toContain("ลัคนา");
      expect(names).toContain("ราศีอาทิตย์");
      expect(names).toContain("ราศีจันทร์");
      expect(names).toContain("MC");
      expect(names).toContain("ลัคนาโหราไทย");
    }
  });

  it("Asc cell shows the ruling planet (เจ้าเรือน) of the rising sign", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      // 1990-01-15 14:30 Bangkok → tropical Asc = เมถุน (Gemini), ruled by พุธ
      const ascCell = grid.cells.find((c) => c.name.includes("Asc"));
      expect(ascCell?.value).toContain("เมถุน");
      expect(ascCell?.note).toContain("พุธ");
    }
  });

  it("whole-sign houses for Sun and Moon are correct for the reference vector", () => {
    // Asc เมถุน(2) · Sun มังกร(9) → house 8 · Moon กันย์(5) → house 4
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const sun = grid.cells.find((c) => c.name.includes("ราศีอาทิตย์"));
      const moon = grid.cells.find((c) => c.name.includes("ราศีจันทร์"));
      expect(sun?.note).toContain("เรือน 8");
      expect(moon?.note).toContain("เรือน 4");
    }
  });

  it("result is rich: verdict + rising-sign framing + practical guidance present", () => {
    const r = ascEngine.build(VALS);
    expect(r.some((s) => s.kind === "verdict")).toBe(true);
    const proseTitles = r
      .filter((s) => s.kind === "prose")
      .map((s) => (s.kind === "prose" ? s.title : ""));
    expect(proseTitles.some((t) => t.includes("คำแนะนำเชิงปฏิบัติ"))).toBe(true);
    expect(proseTitles.some((t) => t.includes("เรือนสำคัญ"))).toBe(true);
    // no empty paragraphs anywhere
    for (const s of r) {
      if (s.kind === "prose") for (const p of s.paras) expect(p.t.length).toBeGreaterThan(0);
    }
  });

  it("time-sensitivity warning is present (ascendant shifts ~2h)", () => {
    const r = ascEngine.build(VALS);
    const all = JSON.stringify(r);
    expect(all).toContain("2 ชั่วโมง");
  });

  it("ascendant actually shifts sign across a ~2h window (time matters)", () => {
    const early = ascEngine.build(["1990-01-15", "12:30", "กรุงเทพมหานคร"]);
    const late = ascEngine.build(["1990-01-15", "16:30", "กรุงเทพมหานคร"]);
    const ascOf = (r: ReturnType<typeof ascEngine.build>) => {
      const g = r.find((s) => s.kind === "grid");
      return g && g.kind === "grid" ? g.cells.find((c) => c.name.includes("Asc"))?.value : undefined;
    };
    expect(ascOf(early)).toBeTruthy();
    expect(ascOf(late)).toBeTruthy();
    expect(ascOf(early)).not.toEqual(ascOf(late));
  });

  it("reference vector: Sun sign = มังกร (Capricorn) for 1990-01-15", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const sun = grid.cells.find((c) => c.name.includes("ราศีอาทิตย์"));
      expect(sun?.value).toContain("มังกร");
    }
  });

  it("reference vector: tropical Asc differs from Thai sidereal lagna", () => {
    const r = ascEngine.build(VALS);
    const grid = r.find((s) => s.kind === "grid");
    if (grid && grid.kind === "grid") {
      const trop = grid.cells.find((c) => c.name.includes("ลัคนา") && !c.name.includes("ไทย"));
      const thai = grid.cells.find((c) => c.name.includes("ลัคนาโหราไทย"));
      expect(trop?.value).toBeTruthy();
      expect(thai?.value).toBeTruthy();
      expect(trop?.value).not.toEqual(thai?.value);
    }
  });

  it("invalid input → targeted note (ขาดวันเกิด / ขาดเวลาเกิดเฉพาะเจาะจง)", () => {
    expect(ascEngine.build([""])[0]).toEqual({
      kind: "note",
      text: "กรอกวันเกิดให้ครบ แล้วลองใหม่",
    });
    const noTime = ascEngine.build(["1990-01-15", "", "กรุงเทพมหานคร"]);
    expect(noTime).toHaveLength(1);
    expect(noTime[0].kind === "note" && noTime[0].text.includes("เวลาเกิด")).toBe(true);
  });

  it("unknown city returns a note, not a silent Bangkok chart (regression)", () => {
    const out = ascEngine.build(["1990-01-15", "14:30", "เมืองที่ไม่มีจริง"]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe("note");
    if (out[0].kind === "note") expect(out[0].text).toContain("ไม่พบเมือง");
  });

  it("resolves a Thai city name (เชียงใหม่) and differs from กรุงเทพ", () => {
    const cm = ascEngine.build(["1990-01-15", "14:30", "เชียงใหม่"]);
    expect(() => ReportSchema.parse(cm)).not.toThrow();
    expect(cm[0].kind).not.toBe("note");
    // different latitude → Thai lagna differs from the Bangkok chart
    expect(JSON.stringify(cm)).not.toBe(JSON.stringify(ascEngine.build(VALS)));
  });
});
