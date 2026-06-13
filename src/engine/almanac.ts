// ส่วนขยายปฏิทิน: 納音 / 十二長生 / 空亡 — ฟังก์ชันบริสุทธิ์ ไม่แตะ DOM/เครือข่าย (ตรวจใน masterdata.test)
import type { ElementTH, Gan, Zhi } from "../types";
import {
  CHANGSHENG_NAMES, CHANGSHENG_START, GAN, GAN_E, NAYIN, VOID_BY_XUN, ZHI,
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
