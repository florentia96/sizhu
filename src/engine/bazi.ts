// เครื่องคำนวณปาจื้อ — ฟังก์ชันบริสุทธิ์ รับ object เดียว คืน object เดียว ไม่แตะ DOM/เครือข่าย
import type {
  BaziResult, ComputeInput, ElementTH, Gan, LuckPillar, Pillar,
  Pillars, PillarLabel, RelationKind, RelationPair, TenGod, Zhi,
} from "../types";
import {
  CHONG, CTRL, DAY_PILLAR_OFFSET, GAN, GAN_E, GEN, GROUP, HAI, HIDDEN,
  LIUHE, XING, ZHI,
} from "./constants";
import { julianDay, jdnNoon, sunLongitude, solarTermJD, equationOfTime } from "./astro";
import {
  USE_SOLAR_DEFAULT, WEIGHTS, classifyStrength, STRENGTH_LABEL, usefulAvoid,
} from "./policy";

// สิบเทพ: ความสัมพันธ์ของก้านอื่นเทียบก้านวัน (ครอบทั้ง 5 ความสัมพันธ์ของห้าธาตุ จึงคืนค่าเสมอ)
export function tenGod(dm: Gan, other: Gan): TenGod {
  const [de, dp] = GAN_E[dm];
  const [oe, op] = GAN_E[other];
  const same = dp === op;
  if (oe === de) return same ? "比肩" : "劫財";
  if (GEN[de] === oe) return same ? "食神" : "傷官";
  if (CTRL[de] === oe) return same ? "偏財" : "正財";
  if (CTRL[oe] === de) return same ? "七殺" : "正官";
  return same ? "偏印" : "正印";
}

const normPair = (a: Zhi, b: Zhi): string => [a, b].sort().join("");

// ปฏิสัมพันธ์ระหว่างก้านดินสองตัว
export function relation(z1: Zhi, z2: Zhi): RelationKind[] {
  const k = normPair(z1, z2);
  const r: RelationKind[] = [];
  if (CHONG.some((c) => normPair(c[0], c[1]) === k)) r.push("ชง");
  if (LIUHE.some((c) => normPair(c[0], c[1]) === k)) r.push("ฮะ");
  if (XING.some((c) => normPair(c[0], c[1]) === k)) r.push("เฮ่ง");
  if (HAI.some((c) => normPair(c[0], c[1]) === k)) r.push("ไห่");
  return r;
}

export function compute(opts: ComputeInput): BaziResult {
  const { year, month, day, hour, minute, sex } = opts;
  const tz = opts.tz ?? 7;
  const lon = opts.lon ?? 100.5;
  const useSolar = opts.useSolar ?? USE_SOLAR_DEFAULT;

  // เวลาจริงทางฟิสิกส์ (UT) ของวินาทีเกิด
  const hourLocal = hour + minute / 60;
  const jdBirthUT = julianDay(year, month, day, hourLocal - tz);
  const lambda = sunLongitude(jdBirthUT);

  // เสาเดือน (จาก sector ลองจิจูด เริ่ม 立春 = 315°)
  const monthOrder = Math.floor(((((lambda - 315) % 360) + 360) % 360) / 30); // 0 = 寅
  const monthZhiIdx = (monthOrder + 2) % 12;

  // เสาปี (เปลี่ยนที่ 立春)
  const lichunThisYear = solarTermJD(315, julianDay(year, 2, 4, 0));
  let byear = year;
  if (jdBirthUT < lichunThisYear) byear = year - 1;
  const yStem = ((((byear - 4) % 10) + 10) % 10);
  const yZhi = ((((byear - 4) % 12) + 12) % 12);
  const mStem = ((((yStem % 5) * 2 + 2 + monthOrder) % 10) + 10) % 10;

  // เสาวัน (JDN เที่ยงวัน, late-zi คงวันเดิม)
  const idx60 = (((jdnNoon(year, month, day) + DAY_PILLAR_OFFSET) % 60) + 60) % 60;
  const dStem = idx60 % 10;
  const dZhi = idx60 % 12;

  // ยาม (時辰) จากเวลาสุริยคติจริง
  let solarShift = 0;
  if (useSolar) solarShift = (lon - tz * 15) * 4 + equationOfTime(year, month, day);
  const hs = ((((hourLocal + solarShift / 60) % 24) + 24) % 24);
  const ziIdx = hs >= 23 || hs < 1 ? 0 : Math.floor((hs + 1) / 2);
  const hStem = ((dStem % 5) * 2 + ziIdx) % 10;

  const mk = (g: number, z: number, label: PillarLabel): Pillar => ({
    gan: GAN[g], zhi: ZHI[z], label, gz: GAN[g] + ZHI[z],
  });
  const pillars: Pillars = {
    year: mk(yStem, yZhi, "ปี"),
    month: mk(mStem, monthZhiIdx, "เดือน"),
    day: mk(dStem, dZhi, "วัน"),
    hour: mk(hStem, ziIdx, "เวลา"),
  };
  const dm = pillars.day.gan;
  const all: Pillar[] = [pillars.year, pillars.month, pillars.day, pillars.hour];

  // นับห้าธาตุ (รวมก้านซ่อน)
  const elements: Record<ElementTH, number> = { ไม้: 0, ไฟ: 0, ดิน: 0, ทอง: 0, น้ำ: 0 };
  all.forEach((p) => {
    elements[GAN_E[p.gan][0]]++;
    HIDDEN[p.zhi].forEach((h) => elements[GAN_E[h][0]]++);
  });

  // แข็ง/อ่อน
  const isSupport = (g: TenGod): boolean => GROUP[g] === "พวกพ้อง" || GROUP[g] === "ตรา";
  let support = 0;
  let drain = 0;
  all.forEach((p) => {
    if (p.label !== "วัน") {
      const w = p.label === "เดือน" ? WEIGHTS.stemMonth : WEIGHTS.stemOther;
      if (isSupport(tenGod(dm, p.gan))) support += w;
      else drain += w;
    }
    HIDDEN[p.zhi].forEach((h, i) => {
      let w: number = i === 0 ? WEIGHTS.hiddenPrimary : WEIGHTS.hiddenSecondary;
      if (p.label === "เดือน" && i === 0) w = WEIGHTS.hiddenMonthPrimary;
      if (isSupport(tenGod(dm, h))) support += w;
      else drain += w;
    });
  });
  const ratio = support / (support + drain);
  const strengthLevel = classifyStrength(ratio);
  const strength = STRENGTH_LABEL[strengthLevel];

  // ธาตุใช้เสริม/ควรเลี่ยง
  const dmE = GAN_E[dm][0];
  const { useful, avoid } = usefulAvoid(strengthLevel, dmE);

  // ปฏิสัมพันธ์ก้านล่าง (ทุกคู่เสา)
  const order: [PillarLabel, Zhi][] = [
    ["ปี", pillars.year.zhi], ["เดือน", pillars.month.zhi],
    ["วัน", pillars.day.zhi], ["เวลา", pillars.hour.zhi],
  ];
  const relations: RelationPair[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      relation(order[i][1], order[j][1]).forEach((kind) =>
        relations.push({ kind, a: order[i][0], b: order[j][0], za: order[i][1], zb: order[j][1] }),
      );
    }
  }

  // ต้าอวิ้น (大運)
  const yangYear = GAN_E[GAN[yStem]][1] === 1;
  const male = sex.toUpperCase() === "M";
  const forward = (yangYear && male) || (!yangYear && !male);

  const nextLong = (315 + 30 * (monthOrder + 1)) % 360;
  const prevLong = (315 + 30 * monthOrder) % 360;
  const target = forward ? nextLong : prevLong;
  const degDiff = forward
    ? (((target - lambda) % 360) + 360) % 360
    : (((lambda - target) % 360) + 360) % 360;
  const guess = jdBirthUT + (forward ? 1 : -1) * degDiff * 1.0146;
  const termJD = solarTermJD(target, guess);
  const startAge = Math.round((Math.abs(termJD - jdBirthUT) / 3) * 100) / 100;

  const luckPillars: LuckPillar[] = [];
  for (let k = 1; k <= 8; k++) {
    const step = forward ? k : -k;
    const g = ((((mStem + step) % 10) + 10) % 10);
    const z = ((((monthZhiIdx + step) % 12) + 12) % 12);
    const lo = Math.round((startAge + (k - 1) * 10) * 10) / 10;
    luckPillars.push({
      from: lo,
      to: Math.round((lo + 10) * 10) / 10,
      gz: GAN[g] + ZHI[z],
      gan: GAN[g],
      zhi: ZHI[z],
      tg: tenGod(dm, GAN[g]),
    });
  }

  return {
    pillars,
    dayMaster: dm,
    dayMasterElement: dmE,
    solarShift: Math.round(solarShift * 10) / 10,
    elements,
    strengthLevel,
    strength,
    useful,
    avoid,
    relations,
    luck: { forward, startAge, pillars: luckPillars },
    lambda: Math.round(lambda * 100) / 100,
  };
}
