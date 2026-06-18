import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../shared/forms/CityField";
import { bodyPositions } from "../../astro/ephemeris";
import { aspectsBetween } from "../../astro/aspects";
import { lifePathFromDate, personalYear } from "../_shared/thaiAstro";
import { toUT } from "../natal/engine";
import { PY_THEME, LIFEPATH, TRANSIT_NOTE } from "./content";

const STAR = "#7da6d8";
const GOOD = "#6cc18a";
const WARN = "#d8a64a";
const INFO = "#7da6d8";
const BANGKOK = { name: "กรุงเทพมหานคร", lat: 13.7563, lon: 100.5018, tz: 7 };

const PLANET_TH: Record<string, string> = {
  Sun: "อาทิตย์", Moon: "จันทร์", Mercury: "พุธ", Venus: "ศุกร์",
  Mars: "อังคาร", Jupiter: "พฤหัส", Saturn: "เสาร์",
};
const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

export const lifeEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const dateStr = (vals[0] || "").trim();
    const timeStr = (vals[1] || "").trim();
    const cityName = (vals[2] || "").trim();
    const nowStr = (vals[4] || "").trim();
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(dateStr) ||
      !/^\d{2}:\d{2}$/.test(timeStr) ||
      !cityName ||
      !/^\d{4}-\d{2}-\d{2}$/.test(nowStr)
    ) {
      return [
        { kind: "note", text: "กรอกวันเกิด เวลาเกิด เมืองเกิด และวันที่ที่ต้องการดู ให้ครบ แล้วลองใหม่" },
      ];
    }
    const city = parseCityValue(cityName) ?? BANGKOK;

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

    const asps = aspectsBetween(transitLon, natalLon)
      .sort((x, y) => x.orb - y.orb)
      .slice(0, 6);
    const transitItems = asps.map((a) => {
      const meta = TRANSIT_NOTE[a.type] ?? { th: a.type, tone: "info" as const };
      const accent = meta.tone === "good" ? GOOD : meta.tone === "warn" ? WARN : INFO;
      return {
        title: `${PLANET_TH[a.a]} จร × ${PLANET_TH[a.b]} เดิม`,
        tag: meta.th,
        accent,
        text: `ดาว${PLANET_TH[a.a]}จรกำลังทำมุม ${meta.th} กับดาว${PLANET_TH[a.b]}ในดวงเดิม (คลาด ${a.orb.toFixed(1)}°) — ${
          meta.tone === "good"
            ? "ช่วงเกื้อหนุน เหมาะลงมือเรื่องที่เกี่ยวข้อง"
            : meta.tone === "warn"
              ? "ช่วงท้าทาย/กดดัน ใช้ความรอบคอบและอดทน"
              : "พลังเข้มข้นในด้านนี้ ใช้ให้เป็นจุดเริ่มต้น"
        }`,
        chips: [`คลาด ${a.orb.toFixed(1)}°`],
      };
    });

    const lp = lifePathFromDate(by, bm, bd);
    const py = personalYear(by, bm, bd, ny);

    const cells = [];
    for (let i = -1; i <= 3; i++) {
      const yr = ny + i;
      const p = personalYear(by, bm, bd, yr);
      cells.push({ name: `${yr}`, value: `ปีส่วนตัว ${p}`, note: (PY_THEME[p] || "").split(" — ")[0] });
    }

    const secs: Section[] = [];
    secs.push({
      kind: "verdict",
      score: 0,
      hideRing: true,
      grade: `ปีส่วนตัว ${py}`,
      gradeLabel: `Personal Year ${ny} · ดาวจร ณ ${nowStr}`,
      accent: STAR,
      summary: PY_THEME[py] || "",
      meta: `ดาวจรเทียบดวงเดิม (transit) + ปีส่วนตัว (เลขศาสตร์) · as-of ${nowStr}`,
    });
    if (transitItems.length)
      secs.push({ kind: "blocks", title: "ดาวจรช่วงนี้เทียบดวงเดิม (Transits)", glyph: "行", items: transitItems });
    secs.push({
      kind: "prose",
      title: "ภาพรวมจังหวะชีวิต",
      glyph: "運",
      accent: STAR,
      paras: [
        { h: `เลขชีวิต (Life Path) = ${lp} · ${LIFEPATH[lp]?.k ?? ""}`, t: LIFEPATH[lp]?.d ?? "" },
        { h: `ปีส่วนตัว = ${py}`, t: PY_THEME[py] || "" },
      ],
    });
    secs.push({ kind: "grid", title: "แนวโน้มรายปี (วงจร 9 ปี)", glyph: "年", cells });
    secs.push({
      kind: "note",
      text: "ดาวจร (transit) คำนวณจากตำแหน่งดาวจริง ณ วันที่เลือก เทียบกับดวงกำเนิด · ปีส่วนตัว/เลขชีวิตเป็นชั้นเลขศาสตร์ · ผลทั้งหมด deterministic ตามวันที่ที่ฉีดเข้ามา",
    });
    return secs;
  },
};
