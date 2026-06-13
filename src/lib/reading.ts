// แปลงผล compute() เป็นโครงข้อมูลพร้อมเรนเดอร์ (UI-agnostic) — ใช้ content ที่ validate แล้ว
// สีใช้โทนมืด (EL_DARK) เพราะหน้าผลแสดงบนพื้นราตรีเสมอ
import type {
  BaziResult, ElementTH, Gan, PillarLabel, RelationKind, TenGod, Zhi,
} from "../types";
import { ELEMENTS } from "../types";
import {
  BRANCH_EL, CTRL, EL_CN, GAN_E, GEN, GROUP, HEAD_CN, HIDDEN, TG_TH, ZHI_TH, ZODIAC,
} from "../engine/constants";
import { relation, tenGod } from "../engine/bazi";
import { EL_DARK } from "../tokens/elements";
import { content, type SeasonStateId } from "../content";

export interface ReadingTldr { label: string; value: string; color: string }
export interface HiddenStem { gan: Gan; tg: string; color: string }
export interface ReadingPillar {
  label: PillarLabel; head: string; isDay: boolean;
  gan: Gan; ganEl: ElementTH; ganElCn: string; ganColor: string; ganTg: string;
  zhi: Zhi; zhiEl: ElementTH; zhiElCn: string; zhiColor: string; zhiTh: string; zodiac: string;
  hidden: HiddenStem[];
}
export interface ReadingDomain { title: string; desc: string }
export interface ElementBar { el: ElementTH; cn: string; count: number; pct: number; color: string }
export interface ElementChip { el: ElementTH; cn: string; color: string }
export interface TenGodItem { cn: TenGod; name: string; count: number; meaning: string; group: string }
export interface RelationItem { label: string; pairs: string; meaning: string }
export type LuckKind = "ส่งเสริม" | "ตั้งหลัก" | "ทั่วไป";
export interface LuckCard {
  from: number; to: number; gz: string; gan: Gan; zhi: Zhi;
  el: ElementTH; elCn: string; color: string; tg: string; kind: LuckKind;
}
export interface ColorTip { el: ElementTH; color: string; swatch: string }
export interface Tips {
  colors: ColorTip[]; dirs: string; fields: string;
  careerGroup: string; careerText: string; acts: string;
  weakEl: ElementTH; weakElCn: string; weakColor: string; organ: string;
}
export interface ReadingLuck { forward: boolean; startAge: number; pillars: LuckCard[]; para: string }
export interface Reading {
  dayMaster: Gan; dayMasterElement: ElementTH; dmColor: string;
  polarity: "หยาง" | "ยิน"; polarityNote: string;
  natureName: string; natureDesc: string;
  strength: string; seasonName: string; seasonStateLabel: string;
  seasonPara: string; strengthPara: string; usefulPara: string;
  usefulText: string; avoidText: string; solarShift: number;
  pillars: ReadingPillar[]; domains: ReadingDomain[];
  elementBars: ElementBar[]; usefulChips: ElementChip[]; avoidChips: ElementChip[];
  elements: Record<ElementTH, number>;
  tenGods: TenGodItem[]; relations: RelationItem[];
  tips: Tips; luck: ReadingLuck;
  tldr: ReadingTldr[]; headline: string; headlineSub: string;
}

const col = EL_DARK;
const shortTg = (g: TenGod): string => TG_TH[g].split(" ")[0];

function seasonStateId(dmE: ElementTH, sE: ElementTH): SeasonStateId {
  if (sE === dmE) return "ruling";
  if (GEN[sE] === dmE) return "supported";
  if (GEN[dmE] === sE) return "draining";
  if (CTRL[dmE] === sE) return "controlling";
  return "controlled";
}

function tgCounts(r: BaziResult): Partial<Record<TenGod, number>> {
  const dm = r.dayMaster;
  const c: Partial<Record<TenGod, number>> = {};
  [r.pillars.year, r.pillars.month, r.pillars.hour].forEach((p) => {
    const g = tenGod(dm, p.gan);
    c[g] = (c[g] ?? 0) + 1;
  });
  [r.pillars.year, r.pillars.month, r.pillars.day, r.pillars.hour].forEach((p) =>
    HIDDEN[p.zhi].forEach((h) => {
      const g = tenGod(dm, h);
      c[g] = (c[g] ?? 0) + 1;
    }),
  );
  return c;
}

export function buildReading(r: BaziResult): Reading {
  const dm = r.dayMaster;
  const nat = content.stemNature[dm];
  const polarity: "หยาง" | "ยิน" = GAN_E[dm][1] ? "หยาง" : "ยิน";
  const dmE = r.dayMasterElement;

  // ฤดู + แข็งอ่อน
  const mb = r.pillars.month.zhi;
  const sE = BRANCH_EL[mb];
  const st = content.seasonState[seasonStateId(dmE, sE)];
  const seasonPara =
    `คุณเกิดช่วง “${content.seasonName[mb]}” (เดือน ${mb}) ซึ่งเป็นช่วงที่ธาตุ ${sE} (${EL_CN[sE]}) มีพลังเด่น ` +
    `ธาตุ ${dmE} (${EL_CN[dmE]}) ประจำตัวของคุณจึงอยู่ในสภาวะ “${st.label}” — ${st.desc} ` +
    `จึงเป็นเหตุผลหนึ่งที่กำลังดวงออกมาเป็น “${r.strength}”`;
  const strengthPara = content.strengthPara[r.strengthLevel];

  // ธาตุเสริม/เลี่ยง
  const usefulText = r.useful.map((e) => `${e} (${EL_CN[e]})`).join(" และ ");
  const avoidText = r.avoid.map((e) => `${e} (${EL_CN[e]})`).join(" และ ");
  const colors = [...new Set(r.useful.map((e) => content.elInfo[e].color))].join(" · ");
  const dirs = [...new Set(r.useful.map((e) => content.elInfo[e].dir))].join(" · ");
  const vibes = [...new Set(r.useful.map((e) => content.elInfo[e].vibe))].join(", ");
  const usefulPara =
    `ธาตุที่ช่วยปรับสมดุลให้คุณคือ ${usefulText} ดึงเข้ามาในชีวิตผ่านสีของใช้/เสื้อผ้า (${colors}), ` +
    `ทิศของที่อยู่หรือโต๊ะทำงาน (${dirs}) และแนวกิจกรรมเกี่ยวกับ ${vibes} ` +
    `ส่วนธาตุ ${avoidText} ไม่ใช่สิ่งไม่ดี เพียงแต่มีอยู่มากพออยู่แล้ว จึงใช้แต่พอดี อย่าเพิ่มจนล้น`;

  // สี่เสา
  const order = [r.pillars.year, r.pillars.month, r.pillars.day, r.pillars.hour];
  const pillars: ReadingPillar[] = order.map((p) => {
    const ganEl = GAN_E[p.gan][0];
    const zhiEl = BRANCH_EL[p.zhi];
    const isDay = p.label === "วัน";
    return {
      label: p.label, head: HEAD_CN[p.label], isDay,
      gan: p.gan, ganEl, ganElCn: EL_CN[ganEl], ganColor: col[ganEl],
      ganTg: isDay ? "ตัวเรา" : shortTg(tenGod(dm, p.gan)),
      zhi: p.zhi, zhiEl, zhiElCn: EL_CN[zhiEl], zhiColor: col[zhiEl],
      zhiTh: ZHI_TH[p.zhi], zodiac: ZODIAC[p.zhi],
      hidden: HIDDEN[p.zhi].map((h) => ({
        gan: h, tg: shortTg(tenGod(dm, h)), color: col[GAN_E[h][0]],
      })),
    };
  });
  const domains: ReadingDomain[] = (["ปี", "เดือน", "วัน", "เวลา"] as const).map((k) => ({
    title: content.pillarDomain[k].title,
    desc: content.pillarDomain[k].desc,
  }));

  // ห้าธาตุ
  const maxEl = Math.max(...ELEMENTS.map((e) => r.elements[e]), 1);
  const elementBars: ElementBar[] = ELEMENTS.map((e) => ({
    el: e, cn: EL_CN[e], count: r.elements[e],
    pct: Math.round((r.elements[e] / maxEl) * 100), color: col[e],
  }));
  const usefulChips: ElementChip[] = r.useful.map((e) => ({ el: e, cn: EL_CN[e], color: col[e] }));
  const avoidChips: ElementChip[] = r.avoid.map((e) => ({ el: e, cn: EL_CN[e], color: col[e] }));

  // สิบเทพ
  const counts = tgCounts(r);
  const tenGods: TenGodItem[] = (Object.keys(counts) as TenGod[])
    .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))
    .map((g) => ({ cn: g, name: TG_TH[g], count: counts[g] ?? 0, meaning: content.tgMean[g], group: GROUP[g] }));

  // ปฏิสัมพันธ์
  const Z: [PillarLabel, Zhi][] = [
    ["ปี", r.pillars.year.zhi], ["เดือน", r.pillars.month.zhi],
    ["วัน", r.pillars.day.zhi], ["เวลา", r.pillars.hour.zhi],
  ];
  const byType: Partial<Record<RelationKind, string[]>> = {};
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      relation(Z[i][1], Z[j][1]).forEach((kind) => {
        if (!byType[kind]) byType[kind] = [];
        byType[kind]!.push(`${Z[i][0]}(${Z[i][1]})–${Z[j][0]}(${Z[j][1]})`);
      });
    }
  }
  const relations: RelationItem[] = (Object.keys(byType) as RelationKind[]).map((k) => ({
    label: content.relMean[k].label,
    pairs: byType[k]!.join(", "),
    meaning: content.relMean[k].meaning,
  }));

  // มงคล + สุขภาพ
  const groupTotals: Record<string, number> = {};
  (Object.keys(counts) as TenGod[]).forEach((k) => {
    const g = GROUP[k];
    groupTotals[g] = (groupTotals[g] ?? 0) + (counts[k] ?? 0);
  });
  const topGroup = Object.keys(groupTotals).sort((a, b) => groupTotals[b] - groupTotals[a])[0];
  const weakEl = [...ELEMENTS].sort((a, b) => r.elements[a] - r.elements[b])[0];
  const tips: Tips = {
    colors: r.useful.map((e) => ({ el: e, color: content.elInfo[e].color, swatch: col[e] })),
    dirs,
    fields: [...new Set(r.useful.map((e) => content.elInfo[e].fields))].join(", "),
    careerGroup: topGroup,
    careerText: content.careerByGroup[topGroup] ?? "",
    acts: [...new Set(r.useful.map((e) => content.elInfo[e].vibe))].join(", "),
    weakEl, weakElCn: EL_CN[weakEl], weakColor: col[weakEl], organ: content.organ[weakEl],
  };

  // ต้าอวิ้น
  const usefulSet = new Set(r.useful);
  const avoidSet = new Set(r.avoid);
  const good: LuckCard[] = [];
  const care: LuckCard[] = [];
  const luckPillars: LuckCard[] = r.luck.pillars.map((l) => {
    const el = GAN_E[l.gan][0];
    const kind: LuckKind = usefulSet.has(el) ? "ส่งเสริม" : avoidSet.has(el) ? "ตั้งหลัก" : "ทั่วไป";
    const item: LuckCard = {
      from: l.from, to: l.to, gz: l.gz, gan: l.gan, zhi: l.zhi,
      el, elCn: EL_CN[el], color: col[el], tg: shortTg(l.tg), kind,
    };
    if (kind === "ส่งเสริม") good.push(item);
    else if (kind === "ตั้งหลัก") care.push(item);
    return item;
  });
  const fmt = (l: LuckCard): string => `${l.from}–${l.to} ปี (${l.gz})`;
  let luckPara = "แต่ละช่วง 10 ปีได้รับอิทธิพลของธาตุต่างกัน ";
  if (good.length)
    luckPara += `ช่วงที่ธาตุ “ส่งเสริม” คุณ ได้แก่ ${good.map(fmt).join(", ")} เป็นจังหวะเหมาะเดินหน้า ลงทุนกับตัวเอง และคว้าโอกาส `;
  if (care.length)
    luckPara += `ส่วนช่วงที่ควร “ตั้งหลักและไม่หักโหม” คือ ${care.map(fmt).join(", ")} เน้นวางรากฐาน ดูแลสุขภาพและความสัมพันธ์ `;
  luckPara += "ทั้งนี้เป็นแนวโน้มกว้าง ๆ ผลจริงขึ้นกับการกระทำและจังหวะที่คุณเลือกเอง";

  const tldr: ReadingTldr[] = [
    { label: "ธาตุประจำตัว", value: `${nat.name} — ${dm} (${dmE} ${EL_CN[dmE]} · ${polarity})`, color: col[dmE] },
    { label: "กำลังดวง", value: r.strength, color: col[dmE] },
    { label: "ธาตุที่ควรเสริม", value: usefulText, color: col[r.useful[0]] },
    { label: "สิบเทพที่เด่นสุด", value: `${tenGods[0].name} · กลุ่ม${tenGods[0].group}`, color: "#d8a64a" },
    { label: "สายงานที่เหมาะ", value: tips.fields, color: "#cfc7b2" },
    {
      label: "ช่วงชีวิตที่น่าจับตา",
      value: good.length ? good.map((l) => `${l.from}–${l.to} ปี`).join(", ") : "ทุกช่วงต้องประคองสมดุล",
      color: "#6cc18a",
    },
  ];

  return {
    dayMaster: dm, dayMasterElement: dmE, dmColor: col[dmE],
    polarity, polarityNote: content.polarityNote[polarity],
    natureName: nat.name, natureDesc: nat.desc,
    strength: r.strength, seasonName: content.seasonName[mb], seasonStateLabel: st.label,
    seasonPara, strengthPara, usefulPara, usefulText, avoidText,
    solarShift: r.solarShift,
    pillars, domains,
    elementBars, usefulChips, avoidChips, elements: r.elements,
    tenGods, relations, tips,
    luck: { forward: r.luck.forward, startAge: r.luck.startAge, pillars: luckPillars, para: luckPara },
    tldr,
    headline: `คุณคือ “${nat.name}”`,
    headlineSub: `ธาตุประจำตัว ${dm} (${dmE} ${EL_CN[dmE]} · ${polarity}) · ${r.strength}`,
  };
}
