import { describe, it, expect } from "vitest";
import { ReportSchema, type Section } from "../../shared/sections/types";
import { engine } from "./engine";

const sample = ["ขึ้นบ้านใหม่", "2025-05"];

function cardsByTitle(out: Section[], title: string) {
  const s = out.find((x) => x.kind === "cards" && x.title === title);
  if (s && s.kind === "cards") return s;
  return null;
}

function dow(iso: string): number {
  return new Date(iso + "T00:00:00Z").getUTCDay();
}

describe("timing engine — ฤกษ์ยาม", () => {
  it("output ผ่าน ReportSchema", () => {
    expect(() => ReportSchema.parse(engine.build(sample))).not.toThrow();
  });

  it("deterministic — input เดิม → output เดิม", () => {
    expect(JSON.stringify(engine.build(sample))).toBe(
      JSON.stringify(engine.build(sample)),
    );
  });

  it("input ไม่ครบ → note", () => {
    const out = engine.build([""]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe("note");
  });

  it("ครบองค์ประกอบ: verdict + prose แนวทาง + กาลโยค grid + note disclaimer", () => {
    const out = engine.build(sample);
    expect(out.find((s) => s.kind === "verdict")).toBeTruthy();
    expect(out.find((s) => s.kind === "prose")).toBeTruthy();
    expect(out.find((s) => s.kind === "grid")).toBeTruthy();
    expect(out.find((s) => s.kind === "note")).toBeTruthy();
  });

  it("มีทั้งวันแนะนำ และวันที่ควรเลี่ยง เป็น cards แยกกัน", () => {
    const out = engine.build(sample);
    expect(cardsByTitle(out, "วันเด่นที่แนะนำ")).toBeTruthy();
    expect(cardsByTitle(out, "วันที่ควรเลี่ยง")).toBeTruthy();
  });

  it("reference vector: พ.ค.2025 (จ.ศ.1387) — วันแนะนำเป็นวันธงชัย/อธิบดี (ศุกร์) ทั้งหมด", () => {
    const out = engine.build(sample);
    const best = cardsByTitle(out, "วันเด่นที่แนะนำ");
    expect(best).toBeTruthy();
    expect(best!.items.length).toBeGreaterThan(0);
    for (const it of best!.items) {
      expect(dow(it.value)).toBe(5); // thongchai=athibodi=Friday this year
    }
  });

  it("วันแนะนำต้องไม่ตรงวันอุบาทว์(พฤหัส)/โลกาวินาศ(อาทิตย์) ปี 2568", () => {
    const out = engine.build(sample);
    for (const title of ["วันเด่นที่แนะนำ", "วันมงคลอื่นที่ใช้ได้"]) {
      const c = cardsByTitle(out, title);
      if (!c) continue;
      for (const it of c.items) {
        expect(dow(it.value)).not.toBe(4); // ubat (inauspicious)
        expect(dow(it.value)).not.toBe(0); // lokawinat (catastrophe)
      }
    }
  });

  it("วันที่ควรเลี่ยง = อุบาทว์(พฤหัส)+โลกาวินาศ(อาทิตย์) เท่านั้น", () => {
    const out = engine.build(sample);
    const avoid = cardsByTitle(out, "วันที่ควรเลี่ยง");
    expect(avoid).toBeTruthy();
    expect(avoid!.items.length).toBeGreaterThan(0);
    for (const it of avoid!.items) {
      expect([0, 4]).toContain(dow(it.value));
    }
  });

  it("ปรับตามประเภทงาน: ออกรถเลี่ยงวันเสาร์ → ไม่มีวันเสาร์ในวันแนะนำ", () => {
    // a month whose good kala-yok day may fall on Saturday: try several months and confirm the recommended day is never Saturday
    for (const m of ["2024-01", "2024-06", "2025-03", "2026-09"]) {
      const out = engine.build(["ออกรถ", m]);
      for (const title of ["วันเด่นที่แนะนำ", "วันมงคลอื่นที่ใช้ได้"]) {
        const c = cardsByTitle(out, title);
        if (!c) continue;
        for (const it of c.items) {
          expect(dow(it.value)).not.toBe(6); // Saturday = avoidDow for buying a car
        }
      }
    }
  });

  it("งานต่างลำดับวันนิยม → ผลต่างกันจริง (favorDow มีน้ำหนัก ไม่ใช่ set เฉย ๆ)", () => {
    // wedding favorDow=[Fri,Thu,Wed] vs car favorDow=[Thu,Fri,Wed] - same set but different order
    // the old code (reading it as a Set) gave the same result every month; the new code must differ in at least one month
    const dayList = (activity: string, m: string): string =>
      ["วันเด่นที่แนะนำ", "วันมงคลอื่นที่ใช้ได้"]
        .map((tt) => cardsByTitle(engine.build([activity, m]), tt)?.items.map((i) => i.value).join(",") ?? "")
        .join("|");
    let differs = false;
    for (let yr = 2024; yr <= 2027 && !differs; yr++) {
      for (let mo = 1; mo <= 12; mo++) {
        const m = `${yr}-${String(mo).padStart(2, "0")}`;
        if (dayList("แต่งงาน", m) !== dayList("ออกรถ", m)) differs = true;
      }
    }
    expect(differs).toBe(true);
  });

  it("prose แสดงหลักเฉพาะของงานที่เลือก (แต่งงาน → กล่าวถึงวันศุกร์)", () => {
    const out = engine.build(["แต่งงาน", "2025-05"]);
    const prose = out.find((s) => s.kind === "prose");
    expect(prose).toBeTruthy();
    if (prose?.kind !== "prose") throw new Error("no prose");
    const joined = prose.paras.map((p) => p.t).join(" ");
    expect(joined).toContain("ศุกร์");
  });

  it("ไม่มีการต่อ 3 รายการขึ้นไปด้วย ' · ' ในประโยค prose/note/verdict", () => {
    const out = engine.build(sample);
    for (const s of out) {
      const texts: string[] = [];
      if (s.kind === "note") texts.push(s.text);
      if (s.kind === "verdict") texts.push(s.summary);
      if (s.kind === "prose") texts.push(...s.paras.map((p) => p.t));
      for (const t of texts) {
        // count the middle-dot (U+00B7) separators - more than 1 means 3+ items joined
        const count = t.split(" · ").length - 1;
        expect(count).toBeLessThanOrEqual(1);
      }
    }
  });
});
