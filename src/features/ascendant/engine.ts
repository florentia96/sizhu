import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../shared/forms/CityField";
import { bodyPositions } from "../../astro/ephemeris";
import { ascendant, midheaven, thaiLagna } from "../../astro/houses";
import { toUT } from "../natal/engine";
import {
  RASI_TH,
  RASI_ORDER,
  RASI_RULER,
  RASI_EL,
  RASI_TRAIT,
  RASI_RISING,
  RASI_MOON,
  EL_NOTE,
  EL_GUIDE,
  HOUSE_MEANING,
} from "./content";

const STAR = "#7da6d8";
const GOLD = "#d8a64a";

function degStr(deg: number): string {
  const d = Math.floor(deg % 30);
  const min = Math.round(((deg % 30) - d) * 60);
  return `${d}°${String(min).padStart(2, "0")}'`;
}

// เรือนแบบ Whole-sign: ราศีลัคนา = เรือน 1, ราศีถัดไป = เรือน 2 ...
function wholeSignHouse(ascRasi: string, targetRasi: string): number {
  const a = RASI_ORDER.indexOf(ascRasi);
  const t = RASI_ORDER.indexOf(targetRasi);
  return ((t - a + 12) % 12) + 1;
}

export const ascEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const dateStr = (vals[0] || "").trim();
    const timeStr = (vals[1] || "").trim();
    const cityName = (vals[2] || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
      return [{ kind: "note", text: "กรอกวันเกิดให้ครบ แล้วลองใหม่" }];
    if (!/^\d{2}:\d{2}$/.test(timeStr))
      return [{ kind: "note", text: "ลัคนาเปลี่ยนราศีทุก ~2 ชั่วโมง ศาสตร์นี้จึงต้องใช้เวลาเกิด กรุณากรอกเวลาเกิด (หากไม่ทราบเวลาที่แน่นอน ให้ใส่เวลาโดยประมาณ)" }];
    if (!cityName)
      return [{ kind: "note", text: "กรอกเมืองเกิดให้ครบ แล้วลองใหม่" }];
    const city = parseCityValue(cityName);
    if (!city)
      return [{ kind: "note", text: `ไม่พบเมือง "${cityName}" — เลือกจากรายการที่ขึ้นให้ หรือพิมพ์พิกัดเป็น lat,lon (เช่น 18.79,98.98)` }];
    const ut = toUT(dateStr, timeStr, city.tz);
    const jdUT = julianDay(ut.y, ut.m, ut.d, ut.hourUT);

    const pos = bodyPositions(jdUT);
    const asc = ascendant({ jdUT, lat: city.lat, lon: city.lon });
    const mc = midheaven({ jdUT, lat: city.lat, lon: city.lon });
    const lagna = thaiLagna({ jdUT, lat: city.lat, lon: city.lon });

    const sunRasi = RASI_TH[pos.Sun.sign];
    const moonRasi = RASI_TH[pos.Moon.sign];
    const ascRasi = RASI_TH[asc.sign];
    const mcRasi = RASI_TH[mc.sign];
    const ascEl = RASI_EL[ascRasi];

    const sunHouse = wholeSignHouse(ascRasi, sunRasi);
    const moonHouse = wholeSignHouse(ascRasi, moonRasi);

    const secs: Section[] = [];

    secs.push({
      kind: "verdict",
      score: 0,
      hideRing: true,
      grade: `ลัคนาราศี${ascRasi}`,
      gradeLabel: `ลัคนาราศี${ascRasi} · อาทิตย์ราศี${sunRasi} · จันทร์ราศี${moonRasi}`,
      accent: STAR,
      summary: `ลัคนาคือราศีที่ขึ้นขอบฟ้าตะวันออกขณะเกิด สะท้อนภาพลักษณ์และวิธีเริ่มต้นเข้าหาสิ่งใหม่ · เกิด ${dateStr} เวลา ${timeStr} น. ที่ ${city.name}`,
      meta: `คำนวณจากตำแหน่งดาวจริง (จักรราศีสากล) · ลัคนาเปลี่ยนราศีทุกราว 2 ชั่วโมง เวลาเกิดที่แม่นยำจึงสำคัญมาก`,
    });

    secs.push({
      kind: "prose",
      title: "สามจุดหลักของดวงคุณ",
      glyph: "昇",
      accent: STAR,
      paras: [
        {
          h: `ลัคนาราศี${ascRasi} — ภาพลักษณ์ / วิธีเริ่มต้น · ${EL_NOTE[ascEl]}`,
          t: `${RASI_RISING[ascRasi]} โดยพื้นนิสัยของราศี${ascRasi}: ${RASI_TRAIT[ascRasi]}`,
        },
        {
          h: `อาทิตย์ในราศี${sunRasi} — แก่นตัวตน`,
          t: `แกนกลางของตัวตนและสิ่งที่ขับเคลื่อนชีวิต: ${RASI_TRAIT[sunRasi]}`,
        },
        {
          h: `จันทร์ในราศี${moonRasi} — โลกภายใน / อารมณ์`,
          t: RASI_MOON[moonRasi],
        },
      ],
    });

    secs.push({
      kind: "grid",
      title: "จุดหลักบนดวง (คำนวณจากดาวจริง)",
      glyph: "星",
      accent: STAR,
      cells: [
        { name: "ลัคนา (แบบสากล)", value: `ราศี${ascRasi} ${degStr(asc.deg)}`, note: `เจ้าเรือนลัคนา: ${RASI_RULER[ascRasi]} · ธาตุ${ascEl}` },
        { name: "ราศีอาทิตย์", value: `ราศี${sunRasi} ${degStr(pos.Sun.deg)}`, note: `ตัวตนแท้จริง · ตกเรือน ${sunHouse} (${HOUSE_MEANING[sunHouse - 1]})` },
        { name: "ราศีจันทร์", value: `ราศี${moonRasi} ${degStr(pos.Moon.deg)}`, note: `อารมณ์ จิตใต้สำนึก · ตกเรือน ${moonHouse} (${HOUSE_MEANING[moonHouse - 1]})` },
        { name: "จุดกลางฟ้า", value: `ราศี${mcRasi} ${degStr(mc.deg)}`, note: "ทิศทางอาชีพ ชื่อเสียง เป้าหมายต่อสาธารณะ" },
        { name: "ลัคนาโหราไทย", value: `ราศี${lagna.rasi} ${degStr(lagna.deg)}`, note: "ปรับด้วยค่าอายนางศะ (ระบบโหราไทย)" },
      ],
    });

    secs.push({
      kind: "prose",
      title: "เรือนสำคัญ — อ่านจากลัคนาแบบทั้งราศี",
      glyph: "宮",
      accent: STAR,
      paras: [
        {
          h: `เรือน 1 (ตัวตน) = ราศี${ascRasi}`,
          t: `ระบบแบบทั้งราศีใช้ราศีลัคนาเป็นเรือน 1 เต็มราศี แล้วนับราศีถัดไปเป็นเรือน 2, 3 ... ไปจนครบ 12 เรือน เป็นวิธีอ่านเรือนที่โหราศาสตร์ไทยและอินเดียใช้เป็นหลัก`,
        },
        {
          h: `อาทิตย์อยู่เรือน ${sunHouse}`,
          t: `ด้านชีวิตที่ตัวตนและพลังของคุณฉายแสงชัดที่สุดคือเรื่อง${HOUSE_MEANING[sunHouse - 1]}`,
        },
        {
          h: `จันทร์อยู่เรือน ${moonHouse}`,
          t: `ใจและความรู้สึกของคุณผูกพันกับเรื่อง${HOUSE_MEANING[moonHouse - 1]} เป็นพิเศษ`,
        },
      ],
    });

    secs.push({
      kind: "prose",
      title: "คำแนะนำเชิงปฏิบัติ",
      glyph: "用",
      accent: GOLD,
      paras: [
        { h: `แนวทางตามธาตุลัคนา (${ascEl})`, t: EL_GUIDE[ascEl] },
        {
          h: "วิธีใช้ดวงนี้ให้เกิดประโยชน์",
          t: "อ่านลัคนาเพื่อเข้าใจ ‘ภาพแรก’ ที่คนเห็น อ่านอาทิตย์เพื่อรู้แก่นที่ควรพัฒนา และอ่านจันทร์เพื่อดูแลใจตัวเอง ทั้งสามจุดทำงานร่วมกัน ไม่ใช่อ่านแยกขาดจากกัน",
        },
      ],
    });

    secs.push({
      kind: "prose",
      title: "ลัคนาตะวันตกต่างจากลัคนาโหราไทยอย่างไร",
      glyph: "盤",
      accent: GOLD,
      paras: [
        { t: "ลัคนาตะวันตกใช้จักรราศีแบบสากล (อิงฤดูกาลและจุดวิษุวัต) ส่วนโหราไทยใช้จักรราศีอิงกลุ่มดาวจริงบนท้องฟ้า ปรับด้วยค่าอายนางศะ ปัจจุบันสองระบบต่างกันราว 24 องศา ลัคนาจึงมักตกคนละราศีกัน เลือกอ่านตามสำนักที่ยึดถือ ทั้งสองไม่ได้ขัดแย้งกัน เพียงใช้คนละมาตรวัด" },
      ],
    });

    secs.push({
      kind: "note",
      text: "ลัคนาและราศีจันทร์คำนวณจากตำแหน่งดาวจริง ร่วมกับเวลาและพิกัดเมืองเกิด เวลาเกิดคลาดเคลื่อนเพียงไม่กี่นาทีอาจทำให้ลัคนาเปลี่ยนราศีได้ จึงควรใช้เวลาที่แม่นยำที่สุด ระบบใช้เขตเวลามาตรฐาน ไม่รวมเวลาออมแสง",
    });

    return secs;
  },
};
