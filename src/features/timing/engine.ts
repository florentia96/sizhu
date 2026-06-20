import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import {
  chulaSakaratForMonth,
  kalaWeekdays,
  gregorianToJDN,
  lunarPhase,
} from "../_shared/thaiLunar";
import { ACTIVITY, KALA_MEANING, WEEKDAY_TH, YAM_MONGKOL } from "./content";
import type { ActivityRule } from "./content";

const GOOD = "#6cc18a";
const INFO = "#7da6d8";
const BAD = "#e0584b";

function parseMonth(m: string): { y: number; mo: number } | null {
  const x = /^(\d{4})-(\d{2})$/.exec(m.trim());
  if (!x) return null;
  let y = parseInt(x[1], 10);
  if (y > 2300) y -= 543; // normalize พ.ศ. → ค.ศ.
  const mo = parseInt(x[2], 10);
  if (mo < 1 || mo > 12) return null;
  return { y, mo };
}

const DEFAULT_RULE: ActivityRule = {
  favorDow: [4, 5],
  avoidDow: [],
  preferWaxing: true,
  principle:
    "โดยทั่วไปนิยมเลือกวันธงชัยหรือวันอธิบดีในช่วงข้างขึ้น และเลี่ยงวันอุบาทว์กับวันโลกาวินาศ",
  guidance: "ควรเลือกวันที่ตรงข้างขึ้นและประกอบพิธีในช่วงเช้าเพื่อเสริมสิริมงคล",
};

interface DayInfo {
  iso: string;
  day: number;
  dow: number;
  kala: "ธงชัย" | "อธิบดี" | null;
  bad: ("อุบาทว์" | "โลกาวินาศ")[];
  waxing: boolean;
  dithi: number;
  favored: boolean; // weekday ที่ activity นิยม
  favRank: number; // ลำดับใน favorDow (0 = นิยมที่สุด, -1 = ไม่อยู่ในลิสต์)
  avoided: boolean; // weekday ที่ activity ให้เลี่ยง
  score: number;
  reasons: string[];
}

function phaseText(waxing: boolean, dithi: number): string {
  return waxing ? `ข้างขึ้น ${dithi} ค่ำ` : `ข้างแรม ${dithi} ค่ำ`;
}

export const engine: FeatureEngine = {
  build(vals: string[]): Section[] {
    const activity = (vals[0] ?? "").trim();
    const parsed = parseMonth(vals[1] ?? "");
    if (!activity || !parsed) {
      return [{ kind: "note", text: "เลือกประเภทงานและเดือน แล้วลองใหม่อีกครั้ง" }];
    }
    const { y, mo } = parsed;
    const rule = ACTIVITY[activity] ?? DEFAULT_RULE;
    const cs = chulaSakaratForMonth(y, mo);
    const w = kalaWeekdays(cs);
    const avoidSet = new Set(rule.avoidDow);

    const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    const all: DayInfo[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
      const phase = lunarPhase(gregorianToJDN(y, mo, d));
      const kala: DayInfo["kala"] =
        dow === w["ธงชัย"] ? "ธงชัย" : dow === w["อธิบดี"] ? "อธิบดี" : null;
      const bad: DayInfo["bad"] = [];
      if (dow === w["อุบาทว์"]) bad.push("อุบาทว์");
      if (dow === w["โลกาวินาศ"]) bad.push("โลกาวินาศ");

      const favRank = rule.favorDow.indexOf(dow); // -1 = ไม่นิยม, 0 = นิยมที่สุด
      const favored = favRank >= 0;
      const avoided = avoidSet.has(dow);
      const reasons: string[] = [];
      let score = 0;
      if (kala) {
        score += 4;
        reasons.push(`วัน${kala}`);
      }
      if (favored) {
        // ลำดับใน favorDow มีน้ำหนัก — วันที่นิยมที่สุดได้คะแนนมากกว่า → งานต่างกันจัดอันดับวันต่างกันจริง
        score += Math.max(1, 3 - favRank);
        reasons.push(`วัน${WEEKDAY_TH[dow]} เหมาะกับงานนี้`);
      }
      if (phase.waxing && rule.preferWaxing) {
        score += 2;
        reasons.push("ตรงช่วงข้างขึ้น");
      }
      if (avoided) score -= 4;
      if (bad.length) score -= 6;

      all.push({
        iso: `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        day: d,
        dow,
        kala,
        bad,
        waxing: phase.waxing,
        dithi: phase.dithi,
        favored,
        favRank,
        avoided,
        score,
        reasons,
      });
    }

    // วันแนะนำ = (วันกาลโยคดี ธงชัย/อธิบดี หรือ วันในสัปดาห์ที่ตำรานิยมสำหรับงานนี้)
    //           ที่พ้นวันร้าย และไม่ตรงวันที่งานนี้ให้เลี่ยง
    const recommended = all.filter(
      (x) => (x.kala || x.favored) && x.bad.length === 0 && !x.avoided,
    );
    // จัดอันดับ: คะแนนมาก่อน แล้วตามด้วยวันที่
    const ranked = [...recommended].sort(
      (a, b) => b.score - a.score || a.day - b.day,
    );
    const topScore = ranked.length ? ranked[0].score : 0;
    const best = ranked.filter((x) => x.score === topScore);
    const others = ranked.filter((x) => x.score < topScore);

    // วันที่ควรเลี่ยง = อุบาทว์/โลกาวินาศ ในเดือนนั้น (ยุบเป็นรายวันในสัปดาห์ที่เป็นตัวแทน)
    const avoidDays = all.filter((x) => x.bad.length > 0);

    const summaryLine =
      best.length > 0
        ? `เดือนนี้มีวันที่เหมาะกับงาน "${activity}" รวม ${recommended.length} วัน โดยมีวันที่เด่นที่สุด ${best.length} วัน`
        : recommended.length > 0
          ? `เดือนนี้มีวันที่พอเหมาะกับงาน "${activity}" รวม ${recommended.length} วัน แต่ยังไม่ตรงกับวันในสัปดาห์ที่นิยมที่สุด`
          : `เดือนนี้ไม่มีวันธงชัยหรือวันอธิบดีที่พ้นวันร้ายและตรงกับธรรมเนียมของงาน "${activity}"`;

    const secs: Section[] = [
      {
        kind: "verdict",
        score: 0,
        grade: "時",
        gradeLabel: "หาฤกษ์",
        accent: best.length > 0 ? GOOD : INFO,
        hideRing: true,
        summary: summaryLine,
        meta: `กาลโยค จ.ศ. ${cs}`,
      },
      {
        kind: "prose",
        title: `แนวทางฤกษ์สำหรับ "${activity}"`,
        glyph: "時",
        accent: INFO,
        paras: [
          { h: "หลักของงานนี้", t: rule.principle },
          { h: "คำแนะนำเฉพาะกิจ", t: rule.guidance },
          { h: "ยามมงคลในแต่ละวัน", t: YAM_MONGKOL },
        ],
      },
    ];

    if (best.length > 0) {
      secs.push({
        kind: "cards",
        title: "วันเด่นที่แนะนำ",
        glyph: "吉",
        subtitle:
          "วันที่ได้ทั้งกาลโยคที่ดี วันในสัปดาห์ที่เหมาะกับงาน และช่วงข้างขึ้น",
        accent: GOOD,
        items: best.map((x) => ({
          value: x.iso,
          badge: `${x.kala} · ${WEEKDAY_TH[x.dow]}`,
          note: `${phaseText(x.waxing, x.dithi)} — ${x.reasons.join(", ")}`,
        })),
      });
    }

    if (others.length > 0) {
      secs.push({
        kind: "cards",
        title: "วันมงคลอื่นที่ใช้ได้",
        glyph: "吉",
        subtitle: "วันที่พ้นวันร้ายและเหมาะกับงานนี้ แม้คะแนนรวมจะรองจากกลุ่มวันเด่น",
        accent: INFO,
        items: others.map((x) => ({
          value: x.iso,
          badge: `${x.kala} · ${WEEKDAY_TH[x.dow]}`,
          note: `${phaseText(x.waxing, x.dithi)} — ${x.reasons.join(", ")}`,
        })),
      });
    }

    if (recommended.length === 0) {
      secs.push({
        kind: "note",
        text: "เดือนนี้ไม่มีวันที่ครบเงื่อนไข อาจลองเลือกเดือนถัดไป หรือปรึกษาโหรเพื่อหาฤกษ์เฉพาะบุคคล",
      });
    }

    if (avoidDays.length > 0) {
      secs.push({
        kind: "cards",
        title: "วันที่ควรเลี่ยง",
        glyph: "凶",
        subtitle: "วันอุบาทว์และวันโลกาวินาศตามกาลโยคของเดือนนี้ ไม่เหมาะเริ่มงานมงคล",
        accent: BAD,
        items: avoidDays.map((x) => ({
          value: x.iso,
          badge: `${x.bad.join("/")} · ${WEEKDAY_TH[x.dow]}`,
          note: phaseText(x.waxing, x.dithi),
        })),
      });
    }

    secs.push({
      kind: "grid",
      title: "กาลโยคของช่วงเวลานี้",
      glyph: "曆",
      accent: INFO,
      cells: [
        { name: "วันธงชัย (มงคล)", value: WEEKDAY_TH[w["ธงชัย"]], note: KALA_MEANING["ธงชัย"] },
        { name: "วันอธิบดี (มงคล)", value: WEEKDAY_TH[w["อธิบดี"]], note: KALA_MEANING["อธิบดี"] },
        { name: "วันอุบาทว์ (เลี่ยง)", value: WEEKDAY_TH[w["อุบาทว์"]], note: KALA_MEANING["อุบาทว์"] },
        { name: "วันโลกาวินาศ (เลี่ยง)", value: WEEKDAY_TH[w["โลกาวินาศ"]], note: KALA_MEANING["โลกาวินาศ"] },
      ],
    });

    secs.push({
      kind: "note",
      text: "คำนวณจากกาลโยค (ปฏิทินจันทรคติไทย) ตามจุลศักราช ร่วมกับธรรมเนียมวันในสัปดาห์ของแต่ละงาน ส่วนค่าข้างขึ้นข้างแรมใช้ค่าเฉลี่ยรอบจันทร์จึงอาจคลาดเคลื่อนได้ประมาณหนึ่งวัน ถือเป็นกรอบอ้างอิงเชิงสัญลักษณ์ ไม่ใช่คำพยากรณ์ตายตัว",
    });
    return secs;
  },
};
