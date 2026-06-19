import type { FeatureEngine } from "../../app/feature";
import type { Section } from "../../shared/sections/types";
import { julianDay } from "../../engine/astro";
import { parseCityValue } from "../../shared/forms/CityField";
import { bodyPositions } from "../../astro/ephemeris";
import { ascendant, thaiLagna } from "../../astro/houses";
import { toUT } from "../natal/engine";
import { RASI_TH, RASI_RULER, RASI_EL, RASI_TRAIT, EL_NOTE } from "./content";

const STAR = "#7da6d8";
const GOLD = "#d8a64a";

function degStr(deg: number): string {
  const d = Math.floor(deg % 30);
  const min = Math.round(((deg % 30) - d) * 60);
  return `${d}°${String(min).padStart(2, "0")}'`;
}

export const ascEngine: FeatureEngine = {
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
    const lagna = thaiLagna({ jdUT, lat: city.lat, lon: city.lon });

    const sunRasi = RASI_TH[pos.Sun.sign];
    const moonRasi = RASI_TH[pos.Moon.sign];
    const ascRasi = RASI_TH[asc.sign];
    const ascEl = RASI_EL[ascRasi];

    const secs: Section[] = [];
    secs.push({
      kind: "prose",
      title: `ลัคนา & ราศีหลัก · ${dateStr} เวลา ${timeStr} น. (${city.name})`,
      glyph: "昇",
      accent: STAR,
      paras: [
        { h: `ลัคนาราศี${ascRasi} (ภาพลักษณ์/วิธีเริ่มต้น) · ${EL_NOTE[ascEl]}`, t: RASI_TRAIT[ascRasi] },
        { h: `อาทิตย์ในราศี${sunRasi} (แก่นตัวตน)`, t: RASI_TRAIT[sunRasi] },
        { h: `จันทร์ในราศี${moonRasi} (โลกภายใน/อารมณ์)`, t: RASI_TRAIT[moonRasi] },
      ],
    });
    secs.push({
      kind: "grid",
      title: "จุดหลักบนดวง (คำนวณจากดาวจริง)",
      glyph: "星",
      accent: STAR,
      cells: [
        { name: "ลัคนา (Asc · tropical)", value: `ราศี${ascRasi} ${degStr(asc.deg)}`, note: `เจ้าเรือน ${RASI_RULER[ascRasi]}` },
        { name: "ราศีอาทิตย์", value: `ราศี${sunRasi} ${degStr(pos.Sun.deg)}`, note: "ตัวตนแท้จริง" },
        { name: "ราศีจันทร์", value: `ราศี${moonRasi} ${degStr(pos.Moon.deg)}`, note: "อารมณ์ จิตใต้สำนึก" },
        { name: "ลัคนาโหราไทย (sidereal)", value: `ราศี${lagna.rasi} ${degStr(lagna.deg)}`, note: "ปรับด้วย Lahiri ayanamsa" },
      ],
    });
    secs.push({
      kind: "prose",
      title: "ลัคนาตะวันตก (tropical) ต่างจากลัคนาโหราไทย (sidereal) อย่างไร",
      glyph: "盤",
      accent: GOLD,
      paras: [
        { t: "ลัคนาตะวันตกใช้ราศีจักรแบบ tropical (อิงฤดูกาล/วิษุวัต) ส่วนโหราไทยใช้ราศีจักรแบบ sidereal (อิงกลุ่มดาวจริง) ปรับด้วยค่า ayanamsa แบบ Lahiri ปัจจุบันต่างกันราว 24° ลัคนาทั้งสองระบบจึงมักอยู่คนละราศีกัน — เลือกอ่านตามสำนักที่ยึดถือ" },
      ],
    });
    secs.push({
      kind: "note",
      text: "ลัคนา/ราศีจันทร์คำนวณจากตำแหน่งดาวจริง + เวลาและพิกัดเมืองเกิด · เวลาเกิดคลาดเคลื่อนเพียงไม่กี่นาทีอาจเปลี่ยนลัคนาได้ · ใช้ standard timezone ไม่รวม DST",
    });
    return secs;
  },
};
