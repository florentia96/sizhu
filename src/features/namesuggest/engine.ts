import type { Section } from "../../shared/sections/types";
import type { FeatureEngine } from "../../app/feature";
import { taksaForDay } from "../../features/_shared/taksa";
import type { BhumiCell } from "../../features/_shared/taksa";
import { dayFromDate } from "../../features/_shared/thaiAstro";
import { NAME_POOL, TONE } from "./content";
import { nameSum } from "./numerology";

function normYear(y: number): number {
  return y > 2300 ? y - 543 : y;
}

// Taksa groups considered supportive, ordered most to least auspicious, used to rank suggested names
const RANK: Record<string, number> = {
  เดช: 0,
  ศรี: 1,
  มนตรี: 2,
  มูละ: 3,
  อุตสาหะ: 4,
};

// Returns the taksa group of the name's first letter (the one treated as the "leading letter")
// skip leading vowels to catch the real initial consonant, e.g. "Pemika" must count "p", not the leading vowel
function leadBhumi(name: string, t: BhumiCell[]): string {
  const lead = [...name].find((ch) => !"เแโใไ".includes(ch)) ?? name[0];
  const hit = t.find((cell) => cell.letters.indexOf(lead) >= 0);
  return hit ? hit.bhumi : "";
}

export function suggestNames(dateStr: string, gender: string, prefix: string): Section[] {
  let dayLabel = "";
  if (dateStr && dateStr.indexOf("-") >= 0) {
    const p = dateStr.split("-").map(Number);
    if (p.length === 3 && p.every((n) => !Number.isNaN(n))) {
      dayLabel = dayFromDate(normYear(p[0]), p[1], p[2]);
    }
  }

  const t = dayLabel ? taksaForDay(dayLabel) : null;
  const kalaSet = new Set<string>();
  if (t) t[7].letters.forEach((L) => kalaSet.add(L));

  const pool = NAME_POOL[gender] || NAME_POOL["ไม่ระบุ"];
  const safe = pool.filter((nm) => {
    if (prefix && nm.indexOf(prefix) !== 0) return false;
    if (!t) return true;
    for (const ch of nm) if (kalaSet.has(ch)) return false;
    return true;
  });

  // Ranking: names whose leading letter is in the decha/sri/montri/moola/utsaha group come first (in auspiciousness order)
  // so the displayed list matches the advice "start with a decha/sri letter"
  // keeps it deterministic with a stable sort, tie-breaking by the original order in the bank
  const ranked = safe
    .map((nm, idx) => {
      const bhumi = t ? leadBhumi(nm, t) : "";
      const rank = bhumi in RANK ? RANK[bhumi] : 90;
      return { nm, bhumi, rank, idx };
    })
    .sort((a, b) => (a.rank !== b.rank ? a.rank - b.rank : a.idx - b.idx));

  const secs: Section[] = [];
  if (t) {
    secs.push({
      kind: "blocks",
      title: "อักษรนำมงคลสำหรับคนเกิดวัน" + dayLabel,
      glyph: "取",
      items: [
        {
          title: "ขึ้นต้นด้วยอักษรเดช/ศรี (แนะนำ)",
          tag: "มงคล",
          accent: TONE.good,
          text: "ชื่อที่ขึ้นต้นหรือมีอักษรกลุ่มนี้ช่วยเสริมอำนาจบารมีและเสน่ห์ ระบบจึงจัดชื่อกลุ่มนี้ไว้ลำดับต้น",
          chips: t[2].letters.concat(t[3].letters),
        },
        {
          title: "เลี่ยงอักษรกาลกิณี",
          tag: "หลีกเลี่ยง",
          accent: TONE.bad,
          text: "ไม่ควรมีพยัญชนะหรือสระกลุ่มนี้อยู่ในชื่อ ระบบคัดออกให้แล้ว",
          chips: t[7].letters,
        },
      ],
    });
  }

  const chosen = ranked.slice(0, 9);
  if (!chosen.length) {
    secs.push({
      kind: "note",
      text: prefix
        ? `ไม่พบชื่อในคลังที่ขึ้นต้นด้วย "${prefix}"${dayLabel ? " และเลี่ยงอักษรกาลกิณีของคนเกิดวัน" + dayLabel : ""} แนะนำให้นำอักษรขึ้นต้นออก หรือเปลี่ยนเป็นอักษรอื่น`
        : `ไม่พบชื่อในคลังที่เลี่ยงอักษรกาลกิณีของคนเกิดวัน${dayLabel} ได้ครบทุกชื่อ`,
    });
  } else {
    secs.push({
      kind: "cards",
      title: dayLabel ? "ชื่อแนะนำ (ผ่านการคัดอักษรกาลกิณีแล้ว)" : "ชื่อแนะนำ",
      glyph: "名",
      subtitle: dayLabel
        ? "ทุกชื่อด้านล่างปลอดอักษรกาลกิณีของคนเกิดวัน" + dayLabel + " และเรียงชื่อที่อักษรนำเป็นมงคลไว้ก่อน"
        : "กรอกวันเกิดเพื่อให้ระบบคัดอักษรกาลกิณีและจัดอันดับอักษรนำมงคลให้",
      items: chosen.map((c) => {
        const ns = nameSum(c.nm);
        const note = c.bhumi in RANK ? "อักษรนำหมู่" + c.bhumi + ", เลข " + ns.reduced : "เลขศาสตร์ " + ns.reduced;
        return { value: c.nm, badge: gender || "", note };
      }),
    });
  }

  if (chosen.length) {
    secs.push({
      kind: "prose",
      title: "แนวทางเลือกชื่อ",
      glyph: "選",
      paras: [
        {
          h: "ลำดับการพิจารณา",
          t: "เริ่มจากชื่อที่อักษรนำอยู่หมู่เดช (อำนาจบารมี) หรือศรี (เสน่ห์ ทรัพย์สิน) เพราะอักษรตัวแรกมีน้ำหนักต่อความหมายของชื่อมากที่สุด หากชอบเสียงหรือความหมายของชื่ออื่นมากกว่า เลือกได้ตามใจตราบที่ชื่อนั้นไม่มีอักษรกาลกิณี",
        },
        {
          h: "เลขศาสตร์ประกอบ",
          t: "เลขท้ายชื่อแต่ละชื่อคือผลรวมเลขศาสตร์แบบย่อหลักเดียว ใช้เป็นข้อมูลเสริมเปรียบเทียบได้ แต่ไม่ควรยึดเป็นเกณฑ์เดียว ค่าผลรวมต่างกันได้ตามตำราของแต่ละสำนัก",
        },
        {
          h: "ก่อนนำไปใช้จริง",
          t: "ควรตรวจการสะกด ความหมาย และความเหมาะสมกับนามสกุลอีกครั้ง หากต้องการความมั่นใจสูงสุดแนะนำให้ปรึกษาผู้เชี่ยวชาญด้านนามศาสตร์ประกอบ",
        },
      ],
    });
  }

  secs.push({
    kind: "note",
    text: "ระบบคัดชื่อที่ไม่มีอักษรกาลกิณีตามวันเกิดจริง และจัดอันดับตามหมู่อักษรนำมงคล ค่าผลรวมเลขศาสตร์ขึ้นกับตารางของแต่ละสำนัก ควรตรวจสอบอีกครั้งก่อนนำไปใช้จริง",
  });
  return secs;
}

export const namesuggestEngine: FeatureEngine = {
  build(vals: string[]): Section[] {
    return suggestNames(vals[0] ?? "", vals[1] ?? "", vals[2] ?? "");
  },
};
