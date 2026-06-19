import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import {
  chulaSakaratForMonth,
  kalaWeekdays,
  gregorianToJDN,
  lunarPhase,
} from "../_shared/thaiLunar";
import { ACTIVITY, WEEKDAY_TH, YAM_MONGKOL } from "./content";

const GOOD = "#6cc18a";
const INFO = "#7da6d8";

function parseMonth(m: string): { y: number; mo: number } | null {
  const x = /^(\d{4})-(\d{2})$/.exec(m.trim());
  if (!x) return null;
  let y = parseInt(x[1], 10);
  if (y > 2300) y -= 543; // normalize พ.ศ. → ค.ศ.
  const mo = parseInt(x[2], 10);
  if (mo < 1 || mo > 12) return null;
  return { y, mo };
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const activity = (vals[0] ?? "").trim();
    const parsed = parseMonth(vals[1] ?? "");
    if (!activity || !parsed) {
      return [{ kind: "note", text: "เลือกประเภทงานและเดือน แล้วลองใหม่อีกครั้ง" }];
    }
    const { y, mo } = parsed;
    const cs = chulaSakaratForMonth(y, mo);
    const w = kalaWeekdays(cs);
    const goodDays = new Set([w["ธงชัย"], w["อธิบดี"]]);
    const badDays = new Set([w["อุบาทว์"], w["โลกาวินาศ"]]);

    const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    const items: { value: string; badge?: string; note?: string }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
      if (!goodDays.has(dow) || badDays.has(dow)) continue;
      const phase = lunarPhase(gregorianToJDN(y, mo, d));
      const cls = dow === w["ธงชัย"] ? "ธงชัย" : "อธิบดี";
      const phaseTxt = phase.waxing
        ? `ข้างขึ้น ${phase.dithi} ค่ำ`
        : `ข้างแรม ${phase.dithi} ค่ำ`;
      items.push({
        value: `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        badge: `${cls} · ${WEEKDAY_TH[dow]}`,
        note: phaseTxt + (phase.waxing ? " (เสริมมงคล)" : ""),
      });
    }

    const secs: Section[] = [
      {
        kind: "prose",
        title: `แนวทางฤกษ์สำหรับ "${activity}"`,
        glyph: "時",
        accent: INFO,
        paras: [
          { h: "หลักทั่วไป", t: ACTIVITY[activity] ?? "เลือกวันธงชัย/อธิบดี ช่วงข้างขึ้น และเลี่ยงวันอุบาทว์/โลกาวินาศ" },
          { h: "ยามมงคลในแต่ละวัน", t: YAM_MONGKOL },
          {
            h: "กาลโยคของปีนี้ (จ.ศ. " + cs + ")",
            t: `วันธงชัย=${WEEKDAY_TH[w["ธงชัย"]]} · อธิบดี=${WEEKDAY_TH[w["อธิบดี"]]} (มงคล) · อุบาทว์=${WEEKDAY_TH[w["อุบาทว์"]]} · โลกาวินาศ=${WEEKDAY_TH[w["โลกาวินาศ"]]} (เลี่ยง)`,
          },
        ],
      },
    ];

    if (items.length > 0) {
      secs.push({
        kind: "cards",
        title: "วันมงคลในเดือนที่เลือก",
        glyph: "吉",
        subtitle: "วันธงชัย/อธิบดี ที่ไม่ตรงวันอุบาทว์/โลกาวินาศ",
        accent: GOOD,
        items,
      });
    } else {
      secs.push({
        kind: "note",
        text: "เดือนนี้ไม่มีวันธงชัย/อธิบดีที่พ้นวันอุบาทว์/โลกาวินาศ ลองเลือกเดือนอื่นหรือปรึกษาโหร",
      });
    }

    secs.push({
      kind: "note",
      text: "คำนวณจากกาลโยค (ปฏิทินจันทรคติไทย) ตามจุลศักราช · ดิถีใช้ค่าเฉลี่ยรอบจันทร์ (±1 วัน) · เป็นกรอบอ้างอิงเชิงสัญลักษณ์ ไม่ใช่คำพยากรณ์ตายตัว",
    });
    return secs;
  },
};
