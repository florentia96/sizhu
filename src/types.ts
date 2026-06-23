// Central data types of the BaZi system - shared by every layer (engine -> reading -> UI)

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
  /** Timezone (hours), default 7 */
  tz?: number;
  /** Longitude (east = +), default 100.5 (Bangkok) */
  lon?: number;
  /** Adjust to true solar time for hour-pillar selection - default per policy */
  useSolar?: boolean;
  /** Zi-hour school - default per policy (late = wanzishi, early = zaozishi which shifts the day pillar from 23:00) */
  zi?: "late" | "early";
}

export interface BaziResult {
  pillars: Pillars;
  dayMaster: Gan;
  dayMasterElement: ElementTH;
  solarShift: number;
  elements: Record<ElementTH, number>;
  strengthLevel: StrengthLevel;
  /** Thai label of chart strength, e.g. strong self (shenqiang) */
  strength: string;
  useful: ElementTH[];
  avoid: ElementTH[];
  relations: RelationPair[];
  luck: Luck;
  /** Sun's ecliptic longitude at birth (degrees) - debug */
  lambda: number;
}
