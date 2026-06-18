import { describe, it, expect } from "vitest";
import { ReportSchema } from "../../shared/sections/types";
import { engine } from "./engine";

const sample = ["ขึ้นบ้านใหม่", "2025-05"];

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

  it("มี cards ของวันมงคล + prose แนวทาง + note disclaimer", () => {
    const out = engine.build(sample);
    expect(out.find((s) => s.kind === "cards")).toBeTruthy();
    expect(out.find((s) => s.kind === "prose")).toBeTruthy();
    expect(out.find((s) => s.kind === "note")).toBeTruthy();
  });

  it("reference vector: พ.ค.2025 (จ.ศ.1387) ธงชัย=ศุกร์ → วันมงคลที่เลือกเป็นวันศุกร์ ข้างขึ้น", () => {
    const out = engine.build(sample);
    const cards = out.find((s) => s.kind === "cards");
    if (cards?.kind !== "cards") throw new Error("no cards");
    expect(cards.items.length).toBeGreaterThan(0);
    for (const it of cards.items) {
      const d = new Date(it.value + "T00:00:00Z");
      expect([5]).toContain(d.getUTCDay()); // 5 = ศุกร์
    }
  });

  it("ไม่แนะนำวันอุบาทว์/โลกาวินาศ (พฤหัส/อาทิตย์ ปี 2568)", () => {
    const out = engine.build(sample);
    const cards = out.find((s) => s.kind === "cards");
    if (cards?.kind !== "cards") throw new Error("no cards");
    for (const it of cards.items) {
      const d = new Date(it.value + "T00:00:00Z").getUTCDay();
      expect(d).not.toBe(4); // อุบาทว์
      expect(d).not.toBe(0); // โลกาวินาศ
    }
  });
});
