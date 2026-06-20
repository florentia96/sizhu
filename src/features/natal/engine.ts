import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../shared/forms/CityField";
import { bodyPositions, signFromLon } from "../../astro/ephemeris";
import { ascendant, midheaven, placidusCusps } from "../../astro/houses";
import { aspectsBetween } from "../../astro/aspects";
import {
  SIGN_TH,
  SIGN_TRAITS,
  PLANET_TH,
  PLANET_MEANING,
  HOUSE_MEANING,
  ASPECT_TH,
  ELEMENT_OF_SIGN,
  ELEMENT_TRAIT,
  ELEMENT_GUIDANCE,
  ANGLE_MEANING,
} from "./content";

const GOOD = "#6cc18a";
const WARN = "#d8a64a";
const INFO = "#7da6d8";
const STAR = "#7da6d8";
const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
      return [{ kind: "note", text: "กรอกวันเกิดให้ครบ แล้วลองใหม่" }];
    if (!/^\d{2}:\d{2}$/.test(timeStr))
      return [{ kind: "note", text: "ดวงกำเนิดต้องใช้เวลาเกิดในการคำนวณลัคนา จุดกลางฟ้า และเรือนชะตา กรุณากรอกเวลาเกิด (หากไม่ทราบเวลาที่แน่นอน ให้ใส่เวลาโดยประมาณ)" }];
    if (!cityName)
      return [{ kind: "note", text: "กรอกเมืองเกิดให้ครบ แล้วลองใหม่" }];
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

    const mc = midheaven({ jdUT, lat: city.lat, lon: city.lon });
    const ascDeg = signFromLon(asc.deg).deg;
    const mcDeg = signFromLon(mc.deg).deg;

    const cells = PLANET_ORDER.map((p) => {
      const b = pos[p as keyof typeof pos];
      const h = houseOf(b.lon, cusps);
      return {
        name: PLANET_TH[p] + (p === "Sun" ? " ☉" : ""),
        value: `ราศี${SIGN_TH[b.sign]} ${degStr(b.deg)}`,
        note: `อยู่เรือน ${h} (${HOUSE_MEANING[h - 1]}) — ${PLANET_MEANING[p]}`,
      };
    });
    cells.push({
      name: "ลัคนา (Asc)",
      value: `ราศี${SIGN_TH[asc.sign]} ${degStr(ascDeg)}`,
      note: ANGLE_MEANING.asc,
    });
    cells.push({
      name: "กลางฟ้า (MC)",
      value: `ราศี${SIGN_TH[mc.sign]} ${degStr(mcDeg)}`,
      note: ANGLE_MEANING.mc,
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
          meta.tone === "good" ? "พลังของดาวสองดวงเกื้อหนุนกัน ช่วยให้เรื่องนั้นลื่นไหล" : meta.tone === "warn" ? "พลังของดาวสองดวงกดดันและท้าทายกัน ต้องอาศัยการปรับสมดุล" : "พลังของดาวสองดวงหลอมรวมและทำงานไปด้วยกัน"
        }`,
        chips: [`คลาด ${a.orb.toFixed(1)}°`],
      };
    });

    // สมดุลธาตุ: นับดาวพระเคราะห์ 7 ดวง + ลัคนา = 8 จุด แยกตาม 4 ธาตุ
    const elementCount: Record<string, number> = { ไฟ: 0, ดิน: 0, ลม: 0, น้ำ: 0 };
    for (const p of PLANET_ORDER) elementCount[ELEMENT_OF_SIGN[pos[p as keyof typeof pos].sign]]++;
    elementCount[ELEMENT_OF_SIGN[asc.sign]]++;
    const ELEMENT_ORDER = ["ไฟ", "ดิน", "ลม", "น้ำ"];
    const maxEl = Math.max(...ELEMENT_ORDER.map((e) => elementCount[e]));
    const minEl = Math.min(...ELEMENT_ORDER.map((e) => elementCount[e]));
    const dominantEl = ELEMENT_ORDER.find((e) => elementCount[e] === maxEl) as string;
    const lackingEl = ELEMENT_ORDER.find((e) => elementCount[e] === minEl) as string;
    const elementCards = ELEMENT_ORDER.map((e) => ({
      value: `ธาตุ${e} ${elementCount[e]}/8`,
      badge: e === dominantEl ? "เด่นที่สุด" : elementCount[e] === 0 ? "ไม่มีดาว" : undefined,
      note: ELEMENT_TRAIT[e],
    }));

    // ขอบเรือนทั้ง 12 (house cusps) — แสดงโครงสร้างเรือนชะตาทั้งดวง
    const houseCards = cusps.map((c, i) => {
      const s = signFromLon(c);
      return {
        value: `เรือน ${i + 1}: ราศี${SIGN_TH[s.sign]} ${degStr(s.deg)}`,
        note: HOUSE_MEANING[i],
      };
    });

    const sun = pos.Sun;
    const moon = pos.Moon;
    const sunT = SIGN_TRAITS[sun.sign];
    const moonT = SIGN_TRAITS[moon.sign];
    const ascT = SIGN_TRAITS[asc.sign];
    const mcT = SIGN_TRAITS[mc.sign];

    const secs: Section[] = [];
    secs.push({
      kind: "verdict",
      score: 0,
      hideRing: true,
      grade: `ราศี${SIGN_TH[sun.sign]}`,
      gradeLabel: `อาทิตย์ราศี${SIGN_TH[sun.sign]} · ลัคนาราศี${SIGN_TH[asc.sign]}`,
      accent: STAR,
      summary: `ดวงกำเนิดสำหรับวันที่ ${dateStr} เวลา ${timeStr} น. ที่ ${city.name} แก่นตัวตน (อาทิตย์) เป็นธาตุ${sunT.el} ส่วนภาพลักษณ์และวิธีเริ่มต้น (ลัคนา) เป็นธาตุ${ascT.el}`,
      meta: `คำนวณจากตำแหน่งดาวจริง แบบ tropical zodiac (จักรราศีอิงฤดูกาล) ร่วมกับระบบเรือน Placidus — JD(UT) ${jdUT.toFixed(4)}`,
    });
    secs.push({ kind: "grid", title: "ตำแหน่งดาวในราศีและเรือนชะตา", glyph: "星", accent: STAR, cells });
    secs.push({
      kind: "cards",
      title: "สมดุลธาตุในดวง (Element Balance)",
      glyph: "衡",
      subtitle: "นับจากดาวพระเคราะห์ 7 ดวง รวมลัคนา เป็น 8 จุด",
      accent: STAR,
      items: elementCards,
    });
    if (aspectItems.length)
      secs.push({ kind: "blocks", title: "มุมสัมพันธ์สำคัญ (Aspects)", glyph: "角", items: aspectItems });
    secs.push({
      kind: "cards",
      title: "ขอบเรือนชะตาทั้ง 12 เรือน (House Cusps)",
      glyph: "宮",
      subtitle: "ราศีที่กำกับแต่ละด้านของชีวิต เรียงตามระบบ Placidus",
      accent: STAR,
      items: houseCards,
    });
    secs.push({
      kind: "prose",
      title: "อ่านดวงกำเนิดของคุณ",
      glyph: "盤",
      accent: STAR,
      paras: [
        { h: `อาทิตย์ในราศี${SIGN_TH[sun.sign]} (แก่นตัวตน)`, t: `${PLANET_MEANING.Sun} โดยรวมเป็นคนที่${sunT.tr}` },
        { h: `จันทร์ในราศี${SIGN_TH[moon.sign]} (โลกภายในและอารมณ์)`, t: `${PLANET_MEANING.Moon} เมื่ออยู่ในราศีนี้มักเป็นคนที่${moonT.tr}` },
        { h: `ลัคนาราศี${SIGN_TH[asc.sign]} (ภาพลักษณ์และวิธีเริ่มต้น)`, t: `คนรอบข้างมักมองว่าเป็นคนที่${ascT.tr} ซึ่งเป็นด่านแรกที่ผู้อื่นสัมผัสได้ก่อนรู้จักตัวตนข้างใน` },
        { h: `กลางฟ้าราศี${SIGN_TH[mc.sign]} (เส้นทางงานและภาพในสังคม)`, t: `${ANGLE_MEANING.mc} ราศีนี้สะท้อนสไตล์การทำงานแบบ${mcT.el === sunT.el ? "ที่ไปในทางเดียวกับแก่นตัวตน" : "คนที่"}${mcT.tr}` },
      ],
    });
    secs.push({
      kind: "prose",
      title: "คำแนะนำในการนำไปใช้",
      glyph: "用",
      accent: GOOD,
      paras: [
        {
          h: `จุดแข็งจากธาตุ${dominantEl} (ธาตุที่เด่นที่สุด)`,
          t: ELEMENT_GUIDANCE[dominantEl].strong,
        },
        {
          h: minEl === 0 ? `ส่วนที่ควรเสริม: ธาตุ${lackingEl} (ไม่มีดาวเลย)` : `ส่วนที่ควรเสริม: ธาตุ${lackingEl} (มีน้อยที่สุด)`,
          t: ELEMENT_GUIDANCE[lackingEl].weak,
        },
        {
          h: "มุมมองโดยรวม",
          t: "ดวงกำเนิดเป็นภาพศักยภาพและแนวโน้ม ไม่ใช่คำพยากรณ์ตายตัว ใช้เป็นแนวทางทำความเข้าใจตัวเองและวางแผนชีวิต โดยการตัดสินใจยังขึ้นกับตัวเราเองเป็นหลัก",
        },
      ],
    });
    secs.push({
      kind: "note",
      text: "คำนวณจากตำแหน่งดาวจริงด้วยปฏิทินดาราศาสตร์ แบบ tropical zodiac (จักรราศีอิงฤดูกาล) และระบบเรือน Placidus เวลาเกิดที่คลาดเคลื่อนแม้เพียงไม่กี่นาทีมีผลต่อลัคนา จุดกลางฟ้า และตำแหน่งเรือนได้ ระบบใช้เขตเวลามาตรฐานของเมือง ยังไม่รวมการปรับเวลาออมแสง (DST) หรือเขตเวลาในอดีต",
    });
    return secs;
  },
};
