import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../shared/forms/CityField";
import { bodyPositions } from "../../astro/ephemeris";
import { ascendant, placidusCusps } from "../../astro/houses";
import { aspectsBetween } from "../../astro/aspects";
import { SIGN_TH, SIGN_TRAITS, PLANET_TH, HOUSE_MEANING, ASPECT_TH } from "./content";

const GOOD = "#6cc18a";
const WARN = "#d8a64a";
const INFO = "#7da6d8";
const STAR = "#7da6d8";
const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
const SIGN_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function toUT(
  dateStr: string,
  timeStr: string,
  tz: number,
): { y: number; m: number; d: number; hourUT: number } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "12:00").split(":").map(Number);
  let hourUT = hh + (mm || 0) / 60 - tz;
  let day = d;
  let mon = m;
  let yr = y;
  if (hourUT < 0) {
    hourUT += 24;
    const prev = new Date(Date.UTC(y, m - 1, d - 1));
    yr = prev.getUTCFullYear();
    mon = prev.getUTCMonth() + 1;
    day = prev.getUTCDate();
  } else if (hourUT >= 24) {
    hourUT -= 24;
    const nxt = new Date(Date.UTC(y, m - 1, d + 1));
    yr = nxt.getUTCFullYear();
    mon = nxt.getUTCMonth() + 1;
    day = nxt.getUTCDate();
  }
  return { y: yr, m: mon, d: day, hourUT };
}

// คืนเลขเรือน 1..12 ของลองจิจูด lon โดย cusps[i] = ขอบเรือน i+1 (absolute 0..360)
export function houseOf(lon: number, cusps: number[]): number {
  const L = ((lon % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const start = ((cusps[i] % 360) + 360) % 360;
    const end = ((cusps[(i + 1) % 12] % 360) + 360) % 360;
    const span = (end - start + 360) % 360 || 360;
    const rel = (L - start + 360) % 360;
    if (rel < span) return i + 1;
  }
  return 1;
}

function degStr(deg: number): string {
  const d = Math.floor(deg);
  const min = Math.round((deg - d) * 60);
  return `${d}°${String(min).padStart(2, "0")}'`;
}

export const natalEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const dateStr = (vals[0] || "").trim();
    const timeStr = (vals[1] || "").trim();
    const cityName = (vals[2] || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !/^\d{2}:\d{2}$/.test(timeStr) || !cityName) {
      return [{ kind: "note", text: "กรอกวันเกิด เวลาเกิด และเมืองเกิด ให้ครบ แล้วลองใหม่" }];
    }
    const city = parseCityValue(cityName);
    if (!city)
      return [{ kind: "note", text: `ไม่พบเมือง "${cityName}" — เลือกจากรายการที่ขึ้นให้ หรือพิมพ์พิกัดเป็น lat,lon (เช่น 18.79,98.98)` }];
    const ut = toUT(dateStr, timeStr, city.tz);
    const jdUT = julianDay(ut.y, ut.m, ut.d, ut.hourUT);

    const pos = bodyPositions(jdUT);
    const asc = ascendant({ jdUT, lat: city.lat, lon: city.lon });
    const cusps = placidusCusps({ jdUT, lat: city.lat, lon: city.lon });

    const absLon: Record<string, number> = {};
    for (const p of PLANET_ORDER) absLon[p] = pos[p as keyof typeof pos].lon;

    const cells = PLANET_ORDER.map((p) => {
      const b = pos[p as keyof typeof pos];
      const h = houseOf(b.lon, cusps);
      return {
        name: PLANET_TH[p] + (p === "Sun" ? " ☉" : ""),
        value: `ราศี${SIGN_TH[b.sign]} ${degStr(b.deg)}`,
        note: `เรือน ${h} · ${HOUSE_MEANING[h - 1]}`,
      };
    });
    cells.push({
      name: "ลัคนา (Asc)",
      value: `ราศี${SIGN_TH[asc.sign]} ${degStr(asc.deg - SIGN_ORDER.indexOf(asc.sign) * 30)}`,
      note: "ราศีที่ขึ้นขอบฟ้าตะวันออกตอนเกิด",
    });

    const asps = aspectsBetween(absLon, absLon)
      .filter((a) => a.a !== a.b)
      .filter((a, i, arr) => arr.findIndex((x) => x.a === a.b && x.b === a.a) >= i)
      .sort((x, y) => x.orb - y.orb)
      .slice(0, 8);
    const aspectItems = asps.map((a) => {
      const meta = ASPECT_TH[a.type] ?? { th: a.type, tone: "info" as const };
      const accent = meta.tone === "good" ? GOOD : meta.tone === "warn" ? WARN : INFO;
      return {
        title: `${PLANET_TH[a.a]} – ${PLANET_TH[a.b]}`,
        tag: meta.th,
        accent,
        text: `${PLANET_TH[a.a]} ทำมุม ${meta.th} กับ ${PLANET_TH[a.b]} (คลาด ${a.orb.toFixed(1)}°) — ${
          meta.tone === "good" ? "พลังเกื้อหนุนกัน" : meta.tone === "warn" ? "พลังกดดัน/ท้าทาย ต้องปรับสมดุล" : "พลังหลอมรวมเป็นเรื่องเดียวกัน"
        }`,
        chips: [`คลาด ${a.orb.toFixed(1)}°`],
      };
    });

    const sun = pos.Sun;
    const moon = pos.Moon;
    const sunT = SIGN_TRAITS[sun.sign];
    const ascT = SIGN_TRAITS[asc.sign];

    const secs: Section[] = [];
    secs.push({
      kind: "verdict",
      score: 0,
      hideRing: true,
      grade: `ราศี${SIGN_TH[sun.sign]}`,
      gradeLabel: `อาทิตย์ในราศี${SIGN_TH[sun.sign]} · ลัคนาราศี${SIGN_TH[asc.sign]}`,
      accent: STAR,
      summary: `ดวงกำเนิดที่ ${city.name} · ${dateStr} เวลา ${timeStr} น. — แก่นตัวตน (อาทิตย์) ธาตุ${sunT.el}, ภาพลักษณ์/การเริ่มต้น (ลัคนา) ธาตุ${ascT.el}`,
      meta: `คำนวณตำแหน่งดาวจริง (tropical zodiac) + เรือนแบบ Placidus · JD(UT) ${jdUT.toFixed(4)}`,
    });
    secs.push({ kind: "grid", title: "ตำแหน่งดาวในราศีและเรือนชะตา", glyph: "星", accent: STAR, cells });
    if (aspectItems.length)
      secs.push({ kind: "blocks", title: "มุมสัมพันธ์สำคัญ (Aspects)", glyph: "角", items: aspectItems });
    secs.push({
      kind: "prose",
      title: "อ่านดวงกำเนิดของคุณ",
      glyph: "盤",
      accent: STAR,
      paras: [
        { h: `อาทิตย์ในราศี${SIGN_TH[sun.sign]} (แก่นตัวตน)`, t: sunT.tr },
        { h: `จันทร์ในราศี${SIGN_TH[moon.sign]} (โลกภายใน/อารมณ์)`, t: SIGN_TRAITS[moon.sign].tr },
        { h: `ลัคนาราศี${SIGN_TH[asc.sign]} (ภาพลักษณ์/วิธีเริ่มต้น)`, t: ascT.tr },
      ],
    });
    secs.push({
      kind: "note",
      text: "คำนวณจากตำแหน่งดาวจริงด้วยปฏิทินดาราศาสตร์ (tropical zodiac, เรือนแบบ Placidus) · เวลาเกิดที่คลาดเคลื่อนมีผลต่อลัคนาและเรือน · ใช้ standard timezone ไม่รวม DST/historical-tz",
    });
    return secs;
  },
};
