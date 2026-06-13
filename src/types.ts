// โครงชนิดข้อมูลกลางของระบบปาจื้อ — ใช้ร่วมทุกชั้น (engine → reading → UI)

export type Sex = "M" | "F";

export const ELEMENTS = ["ไม้", "ไฟ", "ดิน", "ทอง", "น้ำ"] as const;
export type ElementTH = (typeof ELEMENTS)[number];

export type Gan =
  | "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

export type Zhi =
  | "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

export type TenGod =
  | "比肩" | "劫財" | "食神" | "傷官" | "偏財"
  | "正財" | "七殺" | "正官" | "偏印" | "正印";

export type PillarLabel = "ปี" | "เดือน" | "วัน" | "เวลา";
export type StrengthLevel = "weak" | "balanced" | "strong";
export type RelationKind = "ชง" | "ฮะ" | "เฮ่ง" | "ไห่";

export interface Pillar {
  gan: Gan;
  zhi: Zhi;
  label: PillarLabel;
  gz: string;
}

export interface Pillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface LuckPillar {
  from: number;
  to: number;
  gz: string;
  gan: Gan;
  zhi: Zhi;
  tg: TenGod;
}

export interface Luck {
  forward: boolean;
  startAge: number;
  pillars: LuckPillar[];
}

export interface RelationPair {
  kind: RelationKind;
  a: PillarLabel;
  b: PillarLabel;
  za: Zhi;
  zb: Zhi;
}

export interface ComputeInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  sex: Sex;
  /** เขตเวลา (ชม.) ดีฟอลต์ 7 */
  tz?: number;
  /** ลองจิจูด (ตะวันออก = +) ดีฟอลต์ 100.5 (กรุงเทพ) */
  lon?: number;
  /** ปรับเป็นเวลาสุริยคติจริงเพื่อเลือกยาม — ดีฟอลต์ตาม policy */
  useSolar?: boolean;
}

export interface BaziResult {
  pillars: Pillars;
  dayMaster: Gan;
  dayMasterElement: ElementTH;
  solarShift: number;
  elements: Record<ElementTH, number>;
  strengthLevel: StrengthLevel;
  /** ป้ายไทยของกำลังดวง เช่น "ตัวแข็ง (身強)" */
  strength: string;
  useful: ElementTH[];
  avoid: ElementTH[];
  relations: RelationPair[];
  luck: Luck;
  /** ลองจิจูดดวงอาทิตย์ตอนเกิด (องศา) — ดีบัก */
  lambda: number;
}
