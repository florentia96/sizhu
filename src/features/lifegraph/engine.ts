import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../astro/cities";
import { bodyPositions } from "../../astro/ephemeris";
import { aspectsBetween } from "../../astro/aspects";
import { lifePathFromDate, personalYear } from "../_shared/thaiAstro";
import { toUT } from "../natal/engine";
import {
  PY_THEME,
  PY_ACTION,
  LIFEPATH,
  TRANSIT_NOTE,
  PLANET_ROLE,
  BENEFIC,
  SCOPE_GUIDE,
} from "./content";

const STAR = "#7da6d8";
const GOOD = "#6cc18a";
const WARN = "#d8a64a";
const INFO = "#7da6d8";

const PLANET_TH: Record<string, string> = {
  Sun: "อาทิตย์", Moon: "จันทร์", Mercury: "พุธ", Venus: "ศุกร์",
  Mars: "อังคาร", Jupiter: "พฤหัส", Saturn: "เสาร์",
};
const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

// ดาวจรที่นิยาม"ช่วงชีวิต" (period) ได้จริง — เคลื่อนช้าพอที่มุมจะคงอยู่หลายวันถึงหลายเดือน
// จันทร์ถูกแยกออก เพราะเคลื่อน ~13°/วัน มุมจรจึงอยู่เพียงไม่กี่ชั่วโมง ใช้บอกบรรยากาศใจรายวันแทน
const SLOW_TRANSITERS = ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

// แต่ละด้าน → ดาวที่เกี่ยวข้องตามหลักโหราศาสตร์ (ใช้กรองดาวจรให้ตรงเรื่องที่ผู้ใช้เน้น)
const SCOPE_PLANETS: Record<string, string[]> = {
  "เน้นการงาน": ["Sun", "Saturn", "Mars", "Jupiter"],
  "เน้นการเงิน": ["Jupiter", "Venus", "Saturn"],
  "เน้นความรัก": ["Venus", "Moon", "Mars"],
};

// โทนของมุม "ร่วม" (conjunction) ขึ้นกับธรรมชาติของดาวที่จรเข้ามา ไม่ใช่กลาง ๆ เสมอ
// ดาวเกื้อหนุนจรมาร่วม = พลังเสริม · ดาวหนักจรมาร่วม = บททดสอบ/กดดัน
function conjunctionTone(transiter: string): "good" | "warn" {
  return BENEFIC.includes(transiter) ? "good" : "warn";
}

function toneAccent(tone: "good" | "warn" | "info"): string {
  return tone === "good" ? GOOD : tone === "warn" ? WARN : INFO;
}

function toneAdvice(tone: "good" | "warn" | "info"): string {
  if (tone === "good") return "เป็นจังหวะเกื้อหนุน เหมาะลงมือเรื่องที่เกี่ยวข้อง";
  if (tone === "warn") return "เป็นช่วงท้าทายหรือกดดัน ควรใช้ความรอบคอบและความอดทน";
  return "เป็นช่วงที่พลังด้านนี้เข้มข้น เหมาะใช้เป็นจุดเริ่มต้น";
}

// ปีส่วนตัวแบบอิงรอบวันเกิด (birthday-to-birthday) — ก่อนวันเกิดของปีนั้นให้นับเป็นปีก่อนหน้า
// personalYear ใน _shared อิงปีปฏิทิน (เปลี่ยนเลขวันที่ 1 ม.ค.) จึงปรับ effective year ที่ชั้นนี้แทน
// โดยไม่แตะ _shared ทำให้ "ณ วันที่" ก่อน/หลังวันเกิดให้เลขปีส่วนตัวที่ต่างกันอย่างถูกต้อง
function personalYearAsOf(
  by: number, bm: number, bd: number,
  ny: number, nm: number, nd: number,
): number {
  const beforeBirthday = nm < bm || (nm === bm && nd < bd);
  return personalYear(by, bm, bd, beforeBirthday ? ny - 1 : ny);
}

export const lifeEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const dateStr = (vals[0] || "").trim();
    const timeStr = (vals[1] || "").trim();
    const cityName = (vals[2] || "").trim();
    const scope = (vals[3] || "").trim();
    const nowStr = (vals[4] || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
      return [{ kind: "note", text: "กรอกวันเกิดให้ครบ แล้วลองใหม่" }];
    if (!/^\d{2}:\d{2}$/.test(timeStr))
      return [{ kind: "note", text: "กราฟชีวิตต้องใช้เวลาเกิดในการคำนวณตำแหน่งดาวกำเนิด กรุณากรอกเวลาเกิด (หากไม่ทราบเวลาที่แน่นอน ให้ใส่เวลาโดยประมาณ)" }];
    if (!cityName)
      return [{ kind: "note", text: "กรอกเมืองเกิดให้ครบ แล้วลองใหม่" }];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nowStr))
      return [{ kind: "note", text: "เลือกวันที่ที่ต้องการดู แล้วลองใหม่" }];
    const city = parseCityValue(cityName);
    if (!city)
      return [{ kind: "note", text: `ไม่พบเมือง "${cityName}" — เลือกจากรายการที่ขึ้นให้ หรือพิมพ์พิกัดเป็น lat,lon (เช่น 18.79,98.98)` }];

    const [by, bm, bd] = dateStr.split("-").map(Number);
    const ut = toUT(dateStr, timeStr, city.tz);
    const natalJD = julianDay(ut.y, ut.m, ut.d, ut.hourUT);
    const natal = bodyPositions(natalJD);

    const [ny, nm, nd] = nowStr.split("-").map(Number);
    const transitJD = julianDay(ny, nm, nd, 12 - city.tz);
    const transit = bodyPositions(transitJD);

    const natalLon: Record<string, number> = {};
    const transitLon: Record<string, number> = {};
    for (const p of PLANETS) {
      natalLon[p] = natal[p as keyof typeof natal].lon;
      transitLon[p] = transit[p as keyof typeof transit].lon;
    }

    // ดาวจรช้า (นิยาม "ช่วง" ได้) เทียบดวงเดิม — จันทร์จรแยกไปอีกชั้นด้านล่าง
    const slowLon: Record<string, number> = {};
    for (const p of SLOW_TRANSITERS) slowLon[p] = transitLon[p];

    const focus = SCOPE_PLANETS[scope];
    const ranked = aspectsBetween(slowLon, natalLon).sort((x, y) => x.orb - y.orb);
    // เมื่อเลือกด้าน: ให้ดาวจร (a) อยู่ในกลุ่มของด้านนั้น เพื่อให้ "ดาวที่กำลังเคลื่อน" ตรงเรื่อง
    const asps = (
      focus ? ranked.filter((a) => focus.includes(a.a) || focus.includes(a.b)) : ranked
    ).slice(0, 6);

    const transitItems = asps.map((a) => {
      const base = TRANSIT_NOTE[a.type] ?? { th: a.type, tone: "info" as const };
      const tone = a.type === "conjunction" ? conjunctionTone(a.a) : base.tone;
      const accent = toneAccent(tone);
      return {
        title: `${PLANET_TH[a.a]} จร × ${PLANET_TH[a.b]} เดิม`,
        tag: base.th,
        accent,
        text:
          `ดาว${PLANET_TH[a.a]}จร (${PLANET_ROLE[a.a]}) ทำมุม ${base.th} ` +
          `กับดาว${PLANET_TH[a.b]}ในดวงเดิม (${PLANET_ROLE[a.b]}) คลาด ${a.orb.toFixed(1)}° — ` +
          toneAdvice(tone),
        chips: [`คลาด ${a.orb.toFixed(1)}°`],
      };
    });

    // จันทร์จร — บรรยากาศใจระยะสั้น (รายวัน) ไม่ใช่ทิศทางของช่วง
    const moonAsps = aspectsBetween({ Moon: transitLon.Moon }, natalLon)
      .sort((x, y) => x.orb - y.orb)
      .slice(0, 1);

    const lp = lifePathFromDate(by, bm, bd);
    const py = personalYearAsOf(by, bm, bd, ny, nm, nd);

    const cells = [];
    for (let i = -1; i <= 3; i++) {
      const yr = ny + i;
      const p = personalYearAsOf(by, bm, bd, yr, nm, nd);
      const phase = p === 1 ? "เริ่มรอบใหม่" : p === 9 ? "ปลายรอบ" : "";
      cells.push({
        name: yr === ny ? `${yr} (ปีนี้)` : `${yr}`,
        value: `ปีส่วนตัว ${p}`,
        note: [(PY_THEME[p] || "").split(" — ")[0], phase].filter(Boolean).join(" · "),
      });
    }

    const guide = SCOPE_GUIDE[scope] || SCOPE_GUIDE["ภาพรวมปีนี้"];
    const goodCount = transitItems.filter((t) => t.accent === GOOD).length;
    const warnCount = transitItems.filter((t) => t.accent === WARN).length;
    const balance =
      transitItems.length === 0
        ? "ช่วงนี้ไม่มีดาวจรเด่นในด้านนี้ จังหวะค่อนข้างนิ่ง เหมาะตั้งหลักมากกว่าบุก"
        : goodCount > warnCount
          ? "ช่วงนี้ดาวเกื้อหนุนมากกว่ากดดัน โดยรวมเป็นจังหวะที่เดินหน้าได้"
          : warnCount > goodCount
            ? "ช่วงนี้ดาวกดดันมากกว่าเกื้อหนุน ควรตั้งรับและลดความเสี่ยงไว้ก่อน"
            : "ช่วงนี้ดาวเกื้อหนุนและกดดันก้ำกึ่งกัน ควรเลือกจังหวะลงมือให้ดี";

    const secs: Section[] = [];
    secs.push({
      kind: "verdict",
      score: 0,
      hideRing: true,
      grade: `ปีส่วนตัว ${py}`,
      gradeLabel: `${focus ? scope + " · " : ""}ดาวจร ณ ${nowStr}`,
      accent: STAR,
      summary: `${PY_THEME[py] || ""} — ${balance}`,
      meta: `ดาวจรเทียบดวงเดิม ณ ${nowStr} + ปีส่วนตัว (ตามเลขศาสตร์ รายปี)`,
    });

    if (transitItems.length)
      secs.push({
        kind: "blocks",
        title: focus ? `ดาวจรช่วงนี้ (${scope})` : "ดาวจรช่วงนี้เทียบดวงเดิม",
        glyph: "行",
        items: transitItems,
      });
    else if (focus)
      secs.push({
        kind: "note",
        text: `ช่วงนี้ยังไม่มีดาวจรเด่นที่เกี่ยวกับ "${scope}" โดยตรง ลองดูแบบ "ภาพรวมปีนี้" เพื่อเห็นดาวจรทุกด้าน`,
      });

    // จุดเน้น + แนวทางปฏิบัติของด้านที่เลือก ผูกธีมปีส่วนตัวเข้ากับดาวจร
    const focusPlanetTh = focus ? focus.map((p) => PLANET_TH[p]).join(" ") : "";
    secs.push({
      kind: "prose",
      title: focus ? `จุดเน้นช่วงนี้ — ${scope}` : "จุดเน้นช่วงนี้ — ภาพรวม",
      glyph: "焦",
      accent: STAR,
      paras: [
        { h: "ภาพรวมจังหวะ", t: `${guide.lead}${focus ? ` (ดาวหลักของด้านนี้: ${focusPlanetTh})` : ""} — ${balance}` },
        { h: "สิ่งที่ควรทำในปีส่วนตัวนี้", t: PY_ACTION[py]?.do ?? "" },
        { h: "สิ่งที่ควรระวังในปีส่วนตัวนี้", t: PY_ACTION[py]?.avoid ?? "" },
      ],
    });

    secs.push({
      kind: "cards",
      title: "แนวทางปฏิบัติช่วงนี้",
      glyph: "策",
      subtitle: focus ? `อิงดาวหลักของ ${scope}` : "อิงดาวจรและธีมปีส่วนตัว",
      accent: STAR,
      items: guide.tips.map((t) => ({ value: t })),
    });

    if (moonAsps.length) {
      const m = moonAsps[0];
      const mNote = TRANSIT_NOTE[m.type] ?? { th: m.type, tone: "info" as const };
      secs.push({
        kind: "note",
        text:
          `บรรยากาศใจวันนี้: ดาวจันทร์จรทำมุม ${mNote.th} กับดาว${PLANET_TH[m.b]}ในดวงเดิม ` +
          `(คลาด ${m.orb.toFixed(1)}°) — จันทร์เคลื่อนเร็วราว 13° ต่อวัน อิทธิพลจึงอยู่เพียงระยะสั้น ใช้ดูอารมณ์รายวันมากกว่าทิศทางของช่วง`,
      });
    }

    secs.push({
      kind: "prose",
      title: "ภาพรวมจังหวะชีวิต",
      glyph: "運",
      accent: STAR,
      paras: [
        { h: `เลขชีวิต = ${lp} · ${LIFEPATH[lp]?.k ?? ""}`, t: LIFEPATH[lp]?.d ?? "" },
        { h: `ปีส่วนตัว = ${py}`, t: PY_THEME[py] || "" },
      ],
    });
    secs.push({ kind: "grid", title: "แนวโน้มรายปี (วงจร 9 ปี)", glyph: "年", cells });
    secs.push({
      kind: "note",
      text:
        "ดาวจรคำนวณจากตำแหน่งดาวจริง ณ วันที่เลือก เทียบกับดวงกำเนิด · " +
        "ปีส่วนตัวและเลขชีวิตเป็นชั้นเลขศาสตร์ (ปีส่วนตัวละเอียดระดับรายปี อิงรอบวันเกิด) · " +
        "ผลทั้งหมดคำนวณแบบกำหนดได้แน่นอนตามวันที่ที่ระบุ ไม่ดึงเวลาปัจจุบันของเครื่อง",
    });
    return secs;
  },
};
