// ส่วนขยายปฏิทิน: 納音 / 十二長生 / 空亡 — ฟังก์ชันบริสุทธิ์ ไม่แตะ DOM/เครือข่าย (ตรวจใน masterdata.test)
import type { ElementTH, Gan, Pillars, Zhi } from "../types";
import {
  CHANGSHENG_NAMES, CHANGSHENG_START, GAN, GAN_E, HUAGAI, JIANGXING, LUSHEN,
  NAYIN, SANHE, SANHUI, TAOHUA, TIANGAN_HE, TIANYI, VOID_BY_XUN, WENCHANG,
  YANGREN, YIMA, ZHI,
} from "./constants";

const gi = (g: Gan): number => GAN.indexOf(g);
const zi = (z: Zhi): number => ZHI.indexOf(z);

// ลำดับใน 60 甲子 (0..59) จากก้านบน + ก้านดิน (มีคำตอบเดียวเสมอตามทฤษฎีบทเศษเหลือจีน)
export function sixtyIndex(gan: Gan, zhi: Zhi): number {
  const g = gi(gan);
  const z = zi(zhi);
  for (let k = 0; k < 6; k++) {
    if ((g + 10 * k) % 12 === z) return g + 10 * k;
  }
  return g; // ไม่ถึงในทางปฏิบัติ — ทุกคู่ที่ถูกต้องหาเจอภายใน k<6
}

// 納音 ของเสาหนึ่ง
export function naYin(gan: Gan, zhi: Zhi): { cn: string; th: string; el: ElementTH } {
  const [cn, th, el] = NAYIN[Math.floor(sixtyIndex(gan, zhi) / 2)];
  return { cn, th, el };
}

// สถานะ 12 ช่วงของก้านบน (เช่น ก้านวัน) เมื่อตกบนก้านดินหนึ่ง — หยาง順 / ยิน逆
export function changSheng(stem: Gan, branch: Zhi): string {
  const forward = GAN_E[stem][1] === 1;
  const step = zi(branch) - zi(CHANGSHENG_START[stem]);
  const offset = (((forward ? step : -step) % 12) + 12) % 12;
  return CHANGSHENG_NAMES[offset];
}

// 空亡 (旬空): ก้านดินที่ว่างของรอบวัน — อิงเสาวันตามมาตรฐาน
export function voidBranches(dayGan: Gan, dayZhi: Zhi): readonly [Zhi, Zhi] {
  return VOID_BY_XUN[Math.floor(sixtyIndex(dayGan, dayZhi) / 10)];
}

export interface ShenShaHit {
  star: string;
  where: string[];
}

// 神煞 ที่ตรวจพบในผัง — key ตามก้านวัน (貴人/祿/文昌/羊刃) และก้านดินวัน (將星/桃花/驛馬/華蓋) สแกนทั้งสี่เสา
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

// 合 ระดับกลุ่ม/ก้านบน (แยกจาก relation() ที่เป็นคู่ก้านดิน) — 三合(+半合) / 三會 / 天干五合
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
