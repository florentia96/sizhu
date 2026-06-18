import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { dayFromDate, rasiFromDate, lifePathFromDate, DAY_LORD } from "../_shared/thaiAstro";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../shared/forms/CityField";
import { bodyPositions } from "../../astro/ephemeris";
import { aspectsBetween } from "../../astro/aspects";
import { toUT } from "../natal/engine";
import { EL_HARMONY, SYNASTRY_NOTE, PLANET_TH } from "./content";

const JADE = "#6cc18a";
const GOLD = "#d8a64a";
const STAR = "#7da6d8";
const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
const BANGKOK = { name: "กรุงเทพมหานคร", lat: 13.7563, lon: 100.5018, tz: 7 };

export function reduceSingle(n: number): number {
  let x = n;
  while (x > 9) x = String(x).split("").reduce((a, d) => a + +d, 0);
  return x;
}

// คะแนน deterministic — port ตรงจาก moodee-lib compatReport (บรรทัด 879-883)
export function scoreDeterministic(
  a: { y: number; m: number; d: number },
  b: { y: number; m: number; d: number },
): { score: number; label: string; ra: { s: string; el: string }; rb: { s: string; el: string }; lpa: number; lpb: number; elSame: boolean; elHarmony: boolean } {
  const ra = rasiFromDate(a.m, a.d);
  const rb = rasiFromDate(b.m, b.d);
  const elSame = ra.el === rb.el;
  const elHarmony = EL_HARMONY[ra.el] === rb.el;
  const lpa = lifePathFromDate(a.y, a.m, a.d);
  const lpb = lifePathFromDate(b.y, b.m, b.d);
  let score = 65;
  if (elSame) score += 12;
  if (elHarmony) score += 18;
  if (Math.abs(reduceSingle(lpa) - reduceSingle(lpb)) <= 1) score += 6;
  score = Math.max(40, Math.min(96, score));
  const label =
    score >= 85 ? "เข้ากันดีมาก" : score >= 72 ? "เข้ากันดี" : score >= 60 ? "พอเข้ากันได้" : "ต้องปรับเข้าหากัน";
  return { score, label, ra: { s: ra.s, el: ra.el }, rb: { s: rb.s, el: rb.el }, lpa, lpb, elSame, elHarmony };
}

function dparts(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = (s || "").split("-").map(Number);
  return { y, m, d };
}

function synastryBlock(
  s0: string,
  s1: string,
  t0: string,
  c0: string,
  t1: string,
  c1: string,
): Section | null {
  if (!/^\d{2}:\d{2}$/.test(t0) || !/^\d{2}:\d{2}$/.test(t1) || !c0 || !c1) return null;
  const cityA = parseCityValue(c0) ?? BANGKOK;
  const cityB = parseCityValue(c1) ?? BANGKOK;
  const ua = toUT(s0, t0, cityA.tz);
  const ub = toUT(s1, t1, cityB.tz);
  const posA = bodyPositions(julianDay(ua.y, ua.m, ua.d, ua.hourUT));
  const posB = bodyPositions(julianDay(ub.y, ub.m, ub.d, ub.hourUT));
  const lonA: Record<string, number> = {};
  const lonB: Record<string, number> = {};
  for (const p of PLANETS) {
    lonA[p] = posA[p as keyof typeof posA].lon;
    lonB[p] = posB[p as keyof typeof posB].lon;
  }
  const asps = aspectsBetween(lonA, lonB)
    .sort((x, y) => x.orb - y.orb)
    .slice(0, 6);
  if (!asps.length) return null;
  const items = asps.map((a) => {
    const meta = SYNASTRY_NOTE[a.type] ?? { th: a.type, tone: "info" as const };
    const accent = meta.tone === "good" ? JADE : meta.tone === "warn" ? GOLD : STAR;
    return {
      title: `${PLANET_TH[a.a]} (ฝ่าย 1) × ${PLANET_TH[a.b]} (ฝ่าย 2)`,
      tag: meta.th,
      accent,
      text: `ดาว${PLANET_TH[a.a]}ของฝ่าย 1 ทำมุม ${meta.th} กับดาว${PLANET_TH[a.b]}ของฝ่าย 2 (คลาด ${a.orb.toFixed(1)}°) — ${
        meta.tone === "good"
          ? "พลังเกื้อหนุนระหว่างกัน"
          : meta.tone === "warn"
            ? "จุดดึงดูดที่มาพร้อมความตึง ต้องเข้าใจกัน"
            : "พลังหลอมรวมเป็นแก่นความสัมพันธ์"
      }`,
      chips: [`คลาด ${a.orb.toFixed(1)}°`],
    };
  });
  return { kind: "blocks", title: "ดวงสมพงษ์จากดาวจริง (Synastry)", glyph: "合", items };
}

export const compatEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const s0 = (vals[0] || "").trim();
    const s1 = (vals[1] || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s0) || !/^\d{4}-\d{2}-\d{2}$/.test(s1)) {
      return [{ kind: "note", text: "กรอกวันเกิดของทั้งสองฝ่าย แล้วลองใหม่" }];
    }
    const ca = dparts(s0);
    const cb = dparts(s1);
    const { score, label, ra, rb, lpa, lpb, elSame, elHarmony } = scoreDeterministic(ca, cb);
    const da = dayFromDate(ca.y, ca.m, ca.d);
    const db = dayFromDate(cb.y, cb.m, cb.d);

    const accent = score >= 72 ? JADE : GOLD;
    const pts = [
      {
        title: `ธาตุราศี: ${ra.el} × ${rb.el}`,
        meaning: elSame
          ? "ธาตุเดียวกัน เข้าใจกันลึกซึ้ง แต่ต้องระวังการกระทบแบบเดียวกัน"
          : elHarmony
            ? "ธาตุส่งเสริมกัน เป็นคู่ที่ช่วยให้กันและกันเติบโต"
            : "ธาตุต่างกัน มองโลกคนละมุม หากเปิดใจจะเติมเต็มกันได้",
        fg: elHarmony || elSame ? JADE : GOLD,
      },
      {
        title: `วันเกิด: ${da} × ${db}`,
        meaning: `อุปนิสัยพื้นฐานจากผู้ครองวัน — ${DAY_LORD[da].lord} กับ ${DAY_LORD[db].lord}`,
        fg: STAR,
      },
      {
        title: `เลขชีวิต: ${lpa} × ${lpb}`,
        meaning: "บอกแนวทางชีวิตของแต่ละฝ่าย ยิ่งใกล้กันยิ่งเดินไปทางเดียวกันง่าย",
        fg: GOLD,
      },
    ];
    const advice =
      score >= 85
        ? "คู่นี้ส่งเสริมกันได้ดีเยี่ยม ทั้งธาตุและจังหวะชีวิตเกื้อหนุนกัน เหมาะทั้งเป็นคู่ชีวิตและคู่หูทำงาน"
        : score >= 72
          ? "เข้ากันได้ดี มีพื้นฐานความเข้าใจที่ดีต่อกัน หากดูแลความรู้สึกของอีกฝ่ายสม่ำเสมอ จะมั่นคงยืนยาว"
          : score >= 60
            ? "พอเข้ากันได้ มีทั้งจุดที่ลงตัวและจุดที่ต้องปรับ การสื่อสารอย่างเปิดใจคือกุญแจสำคัญ"
            : "มีความต่างที่ต้องปรับเข้าหากันพอสมควร แต่ความต่างนี้เติมเต็มกันได้ถ้าทั้งคู่ใจกว้างและรับฟัง";

    const base: Section[] = [
      { kind: "compat", score, label, a: `ราศี${ra.s}`, b: `ราศี${rb.s}`, accent, points: pts },
      {
        kind: "grid",
        title: "เทียบรายละเอียดสองฝ่าย",
        glyph: "緣",
        cells: [
          { name: "ฝ่าย 1 · ราศี", value: `ราศี${ra.s}`, note: `ธาตุ${ra.el}` },
          { name: "ฝ่าย 2 · ราศี", value: `ราศี${rb.s}`, note: `ธาตุ${rb.el}` },
          { name: "ฝ่าย 1 · วันเกิด", value: `วัน${da}`, note: DAY_LORD[da].lord },
          { name: "ฝ่าย 2 · วันเกิด", value: `วัน${db}`, note: DAY_LORD[db].lord },
          { name: "ฝ่าย 1 · เลขชีวิต", value: `${lpa}`, note: "แนวทางชีวิต" },
          { name: "ฝ่าย 2 · เลขชีวิต", value: `${lpb}`, note: "แนวทางชีวิต" },
        ],
      },
      { kind: "prose", title: "คำแนะนำสำหรับคู่นี้", glyph: "心", accent, paras: [{ t: advice }] },
    ];
    const trailingNote: Section = {
      kind: "note",
      text: "ประเมินจากธาตุราศี + ผู้ครองวันเกิด + เลขชีวิต (คำนวณได้จริง · deterministic) · ใส่เวลาและเมืองเกิดครบทั้งสองฝ่ายเพื่อปลดล็อกชั้นดวงสมพงษ์ (synastry) จากดาวจริง",
    };
    const syn = synastryBlock(s0, s1, (vals[2] || "").trim(), (vals[3] || "").trim(), (vals[4] || "").trim(), (vals[5] || "").trim());
    return syn ? [...base, syn, trailingNote] : [...base, trailingNote];
  },
};
