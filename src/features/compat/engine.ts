import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { dayFromDate, rasiFromDate, lifePathFromDate, DAY_LORD, LIFEPATH } from "../_shared/thaiAstro";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../astro/cities";
import { bodyPositions } from "../../astro/ephemeris";
import { aspectsBetween } from "../../astro/aspects";
import { toUT } from "../natal/engine";
import { EL_HARMONY, SYNASTRY_NOTE, PLANET_TH, elementPair, SIGN_LOVE_TH } from "./content";

const JADE = "#6cc18a";
const GOLD = "#d8a64a";
const STAR = "#7da6d8";
const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

export function reduceSingle(n: number): number {
  let x = n;
  while (x > 9) x = String(x).split("").reduce((a, d) => a + +d, 0);
  return x;
}

// Deterministic score - building on moodee-lib compatReport
// Adds penalties when elements clash (challenge) and when life paths differ greatly
// Previously only added points, so the minimum score was 65 (a clashing pair scored the same as a neutral pair) and the "needs adjustment" tier never appeared
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
  else if (elHarmony) score += 18;
  else score -= 14; // elements clash (challenge - not the same and not supportive)
  const lpDiff = Math.abs(reduceSingle(lpa) - reduceSingle(lpb));
  if (lpDiff <= 1) score += 6;
  else if (lpDiff >= 4) score -= 6; // life paths differ greatly
  // Safety clamp to [40,96] in case score weights change later (the actual current range is 45-89, so it never hits the edges)
  score = Math.max(40, Math.min(96, score));
  const label =
    score >= 85 ? "เข้ากันดีมาก" : score >= 72 ? "เข้ากันดี" : score >= 60 ? "พอเข้ากันได้" : "ต้องปรับเข้าหากัน";
  return { score, label, ra: { s: ra.s, el: ra.el }, rb: { s: rb.s, el: rb.el }, lpa, lpb, elSame, elHarmony };
}

function dparts(s: string): { y: number; m: number; d: number } {
  const [yRaw, m, d] = (s || "").split("-").map(Number);
  const y = yRaw > 2300 ? yRaw - 543 : yRaw; // normalize BE (Buddhist Era) -> CE
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
  const cityA = parseCityValue(c0);
  const cityB = parseCityValue(c1);
  if (!cityA || !cityB) return null;
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
      title: `${PLANET_TH[a.a]} (คุณ) × ${PLANET_TH[a.b]} (คู่ของคุณ)`,
      tag: meta.th,
      accent,
      text: `ดาว${PLANET_TH[a.a]}ของคุณ ทำมุม ${meta.th} กับดาว${PLANET_TH[a.b]}ของคู่ (คลาด ${a.orb.toFixed(1)}°) — ${
        meta.tone === "good"
          ? "พลังเกื้อหนุนระหว่างกัน"
          : meta.tone === "warn"
            ? "จุดดึงดูดที่มาพร้อมความตึง ต้องเข้าใจกัน"
            : "พลังหลอมรวมเป็นแก่นความสัมพันธ์"
      }`,
      chips: [`คลาด ${a.orb.toFixed(1)}°`],
    };
  });
  return { kind: "blocks", title: "ดวงสมพงษ์จากดาวจริงแบบสากล", glyph: "合", items };
}

export const compatEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const s0 = (vals[0] || "").trim();
    const s1 = (vals[3] || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s0) || !/^\d{4}-\d{2}-\d{2}$/.test(s1)) {
      return [{ kind: "note", text: "กรอกวันเกิดของทั้งสองฝ่าย แล้วลองใหม่" }];
    }
    const ca = dparts(s0);
    const cb = dparts(s1);
    const { score, label, ra, rb, lpa, lpb } = scoreDeterministic(ca, cb);
    const da = dayFromDate(ca.y, ca.m, ca.d);
    const db = dayFromDate(cb.y, cb.m, cb.d);
    const enA = rasiFromDate(ca.m, ca.d).en;
    const enB = rasiFromDate(cb.m, cb.d).en;
    const elPair = elementPair(ra.el, rb.el);

    const accent = score >= 72 ? JADE : GOLD;
    const pts = [
      {
        title: `ธาตุราศี: ${ra.el} × ${rb.el}`,
        meaning: elPair.th,
        fg: elPair.kind === "challenge" ? GOLD : JADE,
      },
      {
        title: `วันเกิด: ${da} × ${db}`,
        meaning: `อุปนิสัยพื้นฐานจากผู้ครองวัน — ${DAY_LORD[da].lord} กับ ${DAY_LORD[db].lord}`,
        fg: STAR,
      },
      {
        title: `เลขชีวิต: ${lpa} × ${lpb}`,
        meaning:
          Math.abs(reduceSingle(lpa) - reduceSingle(lpb)) <= 1
            ? "แนวทางชีวิตใกล้เคียงกัน เดินไปในทิศทางเดียวกันได้ไม่ยาก"
            : "แนวทางชีวิตต่างกัน ต้องหาเป้าหมายร่วมเพื่อก้าวไปด้วยกัน",
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
        title: "เทียบรายละเอียดของทั้งคู่",
        glyph: "緣",
        cells: [
          { name: "คุณ · ราศี", value: `ราศี${ra.s}`, note: `ธาตุ${ra.el}` },
          { name: "คู่ของคุณ · ราศี", value: `ราศี${rb.s}`, note: `ธาตุ${rb.el}` },
          { name: "คุณ · วันเกิด", value: `วัน${da}`, note: DAY_LORD[da].lord },
          { name: "คู่ของคุณ · วันเกิด", value: `วัน${db}`, note: DAY_LORD[db].lord },
          { name: "คุณ · เลขชีวิต", value: `${lpa}`, note: LIFEPATH[lpa]?.k ?? "แนวทางชีวิต" },
          { name: "คู่ของคุณ · เลขชีวิต", value: `${lpb}`, note: LIFEPATH[lpb]?.k ?? "แนวทางชีวิต" },
        ],
      },
      {
        kind: "prose",
        title: "ราศีกับการครองคู่",
        glyph: "緣",
        accent: STAR,
        paras: [
          { h: `คุณ · ราศี${ra.s} (ธาตุ${ra.el})`, t: SIGN_LOVE_TH[enA] ?? "" },
          { h: `คู่ของคุณ · ราศี${rb.s} (ธาตุ${rb.el})`, t: SIGN_LOVE_TH[enB] ?? "" },
          { h: "ธาตุของทั้งคู่", t: elPair.th },
        ],
      },
      { kind: "prose", title: "คำแนะนำสำหรับคู่นี้", glyph: "心", accent, paras: [{ t: advice }] },
    ];
    const syn = synastryBlock(s0, s1, (vals[1] || "").trim(), (vals[2] || "").trim(), (vals[4] || "").trim(), (vals[5] || "").trim());
    const methodNote: Section = {
      kind: "note",
      text: "คะแนนหลักประเมินจากธาตุราศีไทย (แบบนิรายนะ อิงดาวจริง) ร่วมกับผู้ครองวันเกิดและเลขชีวิต ให้ผลคงที่ทุกครั้งที่กรอกข้อมูลเดิม ส่วนชั้นดวงสมพงษ์ใช้ตำแหน่งดาวจริงแบบสากล ซึ่งเป็นคนละระบบกับคะแนนหลัก สองชั้นคำนวณแยกกันและไม่ได้รวมเป็นคะแนนเดียว",
    };
    if (syn) return [...base, syn, methodNote];
    const unlockNote: Section = {
      kind: "prose",
      title: "อยากได้ผลที่ลึกขึ้น",
      glyph: "鎖",
      accent: GOLD,
      paras: [
        { t: "ขณะนี้แสดงเฉพาะชั้นธาตุราศี ผู้ครองวัน และเลขชีวิต ซึ่งใช้เพียงวันเกิดของทั้งคุณและคู่" },
        { t: "หากใส่เวลาเกิดและเมืองเกิดครบทั้งคุณและคู่ จะปลดล็อกชั้นดวงสมพงษ์ที่อ่านมุมสัมพันธ์ระหว่างดาวจริงของทั้งคู่เพิ่มอีกหนึ่งชั้น" },
      ],
    };
    return [...base, unlockNote, methodNote];
  },
};
