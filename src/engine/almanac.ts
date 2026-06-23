// Almanac extensions: NaYin / shi'er changsheng / kongwang - pure functions, no DOM/network (verified in masterdata.test)
import type { ElementTH, Gan, Pillars, Zhi } from "../types";
import {
  CHANGSHENG_NAMES, CHANGSHENG_START, GAN, GAN_E, HUAGAI, JIANGXING, LUSHEN,
  NAYIN, SANHE, SANHUI, TAOHUA, TIANGAN_HE, TIANYI, VOID_BY_XUN, WENCHANG,
  YANGREN, YIMA, ZHI,
} from "./constants";

const gi = (g: Gan): number => GAN.indexOf(g);
const zi = (z: Zhi): number => ZHI.indexOf(z);

// Position in the 60 jiazi cycle (0..59) from stem + branch (always a unique solution by the Chinese remainder theorem)
export function sixtyIndex(gan: Gan, zhi: Zhi): number {
  const g = gi(gan);
  const z = zi(zhi);
  for (let k = 0; k < 6; k++) {
    if ((g + 10 * k) % 12 === z) return g + 10 * k;
  }
  throw new Error(`sixtyIndex: ${gan}${zhi} ไม่ใช่คู่ใน 60 甲子 (ก้าน/กิ่งขั้วไม่ตรง)`);
}

// NaYin of a single pillar
export function naYin(gan: Gan, zhi: Zhi): { cn: string; th: string; el: ElementTH } {
  const [cn, th, el] = NAYIN[Math.floor(sixtyIndex(gan, zhi) / 2)];
  return { cn, th, el };
}

// The 12 life stages of a stem (e.g. the day stem) over a given branch - yang forward / yin reverse
export function changSheng(stem: Gan, branch: Zhi): string {
  const forward = GAN_E[stem][1] === 1;
  const step = zi(branch) - zi(CHANGSHENG_START[stem]);
  const offset = (((forward ? step : -step) % 12) + 12) % 12;
  return CHANGSHENG_NAMES[offset];
}

// kongwang / xunkong (void): the void branches of the day's xun - based on the day pillar per standard
export function voidBranches(dayGan: Gan, dayZhi: Zhi): readonly [Zhi, Zhi] {
  return VOID_BY_XUN[Math.floor(sixtyIndex(dayGan, dayZhi) / 10)];
}

export interface ShenShaHit {
  star: string;
  where: string[];
}

// ShenSha found in the chart - keyed by day stem (guiren/lu/wenchang/yangren) and day branch (jiangxing/taohua/yima/huagai), scanning all four pillars
export function shenSha(pillars: Pillars): ShenShaHit[] {
  const dayGan = pillars.day.gan;
  const dayZhi = pillars.day.zhi;
  const all = [pillars.year, pillars.month, pillars.day, pillars.hour];
  const hits: ShenShaHit[] = [];
  const add = (star: string, targets: readonly Zhi[]): void => {
    const where = all.filter((p) => targets.includes(p.zhi)).map((p) => p.label);
    if (where.length) hits.push({ star, where });
  };
  add("天乙貴人", TIANYI[dayGan]);
  add("祿神", [LUSHEN[dayGan]]);
  add("文昌", [WENCHANG[dayGan]]);
  add("將星", [JIANGXING[dayZhi]]);
  add("桃花", [TAOHUA[dayZhi]]);
  add("驛馬", [YIMA[dayZhi]]);
  add("華蓋", [HUAGAI[dayZhi]]);
  const yr = YANGREN[dayGan];
  if (yr) add("羊刃", [yr]);
  return hits;
}

export interface Combine {
  kind: "三合" | "三會" | "五合";
  chars: string;
  el: ElementTH;
  full: boolean;
}

// he (combinations) at the group/stem level (separate from relation() which handles branch pairs) - sanhe (+banhe) / sanhui / tiangan wuhe
export function combinations(pillars: Pillars): Combine[] {
  const all = [pillars.year, pillars.month, pillars.day, pillars.hour];
  const branches = all.map((p) => p.zhi);
  const stems = all.map((p) => p.gan);
  const out: Combine[] = [];
  for (const [a, b, c, el] of SANHE) {
    const present = [a, b, c].filter((z) => branches.includes(z));
    if (present.length === 3) out.push({ kind: "三合", chars: `${a}${b}${c}`, el, full: true });
    else if (present.length === 2 && present.includes(b))
      out.push({ kind: "三合", chars: present.join(""), el, full: false });
  }
  for (const [a, b, c, el] of SANHUI) {
    if (branches.includes(a) && branches.includes(b) && branches.includes(c))
      out.push({ kind: "三會", chars: `${a}${b}${c}`, el, full: true });
  }
  for (const [a, b, el] of TIANGAN_HE) {
    if (stems.includes(a) && stems.includes(b))
      out.push({ kind: "五合", chars: `${a}${b}`, el, full: true });
  }
  return out;
}

// taiyuan (conception pillar): month stem +1, month branch +3
export function taiYuan(monthGan: Gan, monthZhi: Zhi): { gan: Gan; zhi: Zhi; gz: string } {
  const gan = GAN[(gi(monthGan) + 1) % 10];
  const zhi = ZHI[(zi(monthZhi) + 3) % 12];
  return { gan, zhi, gz: gan + zhi };
}

// minggong (life palace) - standard Ziping: month/hour counted with yin=1, the month rolls to the next once past zhongqi (mid-term), stem from wuhudun (birth year)
// monthOrder: 0=yin..11=chou (from the jie solar term) - pastZhongQi: whether the month's zhongqi (mid-term) has been passed
export function mingGong(
  monthOrder: number,
  pastZhongQi: boolean,
  hourZhi: Zhi,
  yearGan: Gan,
): { gan: Gan; zhi: Zhi; gz: string } {
  const monthNum = ((monthOrder + (pastZhongQi ? 1 : 0)) % 12) + 1; // yin=1
  const hourNum = ((zi(hourZhi) - 2 + 12) % 12) + 1; // the hour is also counted with yin=1
  let L = (14 - (monthNum + hourNum)) % 12;
  if (L <= 0) L += 12; // L = minggong branch number (yin=1), range 1..12
  const zhi = ZHI[(L + 1) % 12]; // L=1 -> yin (index 2)
  const base = [2, 4, 6, 8, 0][gi(yearGan) % 5]; // wuhudun: the stem that lands on yin for that year
  const gan = GAN[(base + (L - 1)) % 10];
  return { gan, zhi, gz: gan + zhi };
}

// xiaoyun (minor luck, before DaYun begins): counted from the hour pillar +-1 per zodiac year - same direction as DaYun (forward for yang-male/yin-female, reverse otherwise)
export function minorLuck(
  hourGan: Gan,
  hourZhi: Zhi,
  forward: boolean,
  untilAge: number,
): { age: number; gz: string }[] {
  const start = sixtyIndex(hourGan, hourZhi);
  const dir = forward ? 1 : -1;
  const n = Math.min(Math.max(0, Math.floor(untilAge)), 10);
  const out: { age: number; gz: string }[] = [];
  for (let k = 1; k <= n; k++) {
    const idx = (((start + dir * k) % 60) + 60) % 60;
    out.push({ age: k, gz: GAN[idx % 10] + ZHI[idx % 12] });
  }
  return out;
}
