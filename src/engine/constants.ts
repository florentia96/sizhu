// [Tier 1] BaZi rules - structural constants, do not change at will (guarded by tests)
// Changing these breaks results system-wide - values that are "tunable per school" live in policy.ts, not here
import type { Gan, Zhi, ElementTH, TenGod } from "../types";

export const GAN: readonly Gan[] = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸",
];
export const ZHI: readonly Zhi[] = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥",
];

export const GAN_TH: Record<Gan, string> = {
  甲: "เจี่ย", 乙: "อี่", 丙: "ปิ่ง", 丁: "ติง", 戊: "อู้",
  己: "จี่", 庚: "เกิง", 辛: "ซิน", 壬: "เหริน", 癸: "กุ่ย",
};
export const ZHI_TH: Record<Zhi, string> = {
  子: "จื่อ", 丑: "โฉ่ว", 寅: "อิ๋น", 卯: "เหม่า", 辰: "เฉิน", 巳: "ซื่อ",
  午: "อู่", 未: "เว่ย", 申: "เซิน", 酉: "โหย่ว", 戌: "ซวี", 亥: "ไห้",
};
export const ZODIAC: Record<Zhi, string> = {
  子: "หนู", 丑: "วัว", 寅: "เสือ", 卯: "กระต่าย", 辰: "มังกร", 巳: "งู",
  午: "ม้า", 未: "แพะ", 申: "ลิง", 酉: "ไก่", 戌: "หมา", 亥: "หมู",
};

// Heavenly stem -> [element, polarity] - polarity 1 = yang, 0 = yin
export const GAN_E: Record<Gan, [ElementTH, 0 | 1]> = {
  甲: ["ไม้", 1], 乙: ["ไม้", 0], 丙: ["ไฟ", 1], 丁: ["ไฟ", 0], 戊: ["ดิน", 1],
  己: ["ดิน", 0], 庚: ["ทอง", 1], 辛: ["ทอง", 0], 壬: ["น้ำ", 1], 癸: ["น้ำ", 0],
};

// Earthly branch -> hidden stems (canggan), the first is the branch's main element
export const HIDDEN: Record<Zhi, Gan[]> = {
  子: ["癸"], 丑: ["己", "癸", "辛"], 寅: ["甲", "丙", "戊"], 卯: ["乙"],
  辰: ["戊", "乙", "癸"], 巳: ["丙", "庚", "戊"], 午: ["丁", "己"],
  未: ["己", "丁", "乙"], 申: ["庚", "壬", "戊"], 酉: ["辛"],
  戌: ["戊", "辛", "丁"], 亥: ["壬", "甲"],
};

// Generating (sheng) and controlling (ke) cycles of the five elements
export const GEN: Record<ElementTH, ElementTH> = {
  ไม้: "ไฟ", ไฟ: "ดิน", ดิน: "ทอง", ทอง: "น้ำ", น้ำ: "ไม้",
};
export const CTRL: Record<ElementTH, ElementTH> = {
  ไม้: "ดิน", ดิน: "น้ำ", น้ำ: "ไฟ", ไฟ: "ทอง", ทอง: "ไม้",
};

// Ten Gods -> Thai label + group
export const TG_TH: Record<TenGod, string> = {
  比肩: "ปี่เจียน (เพื่อน/พี่น้อง)", 劫財: "เจี๋ยไฉ (ชิงทรัพย์)",
  食神: "สือเสิน (เทพกินดี)", 傷官: "ซางกวน (ทำลายอำนาจ)",
  偏財: "เพียนไฉ (ทรัพย์อ้อม)", 正財: "เจิ้งไฉ (ทรัพย์ตรง)",
  七殺: "ชีซา (เจ็ดเพชฌฆาต)", 正官: "เจิ้งกวน (ขุนนางตรง)",
  偏印: "เพียนอิ้น (ตราอ้อม)", 正印: "เจิ้งอิ้น (ตราตรง)",
};
export type TenGodGroup = "พวกพ้อง" | "ตรา" | "ถ่ายพลัง" | "ทรัพย์" | "อำนาจ";
export const GROUP: Record<TenGod, TenGodGroup> = {
  比肩: "พวกพ้อง", 劫財: "พวกพ้อง", 正印: "ตรา", 偏印: "ตรา",
  食神: "ถ่ายพลัง", 傷官: "ถ่ายพลัง", 正財: "ทรัพย์", 偏財: "ทรัพย์",
  正官: "อำนาจ", 七殺: "อำนาจ",
};

// Earthly-branch interactions
export const CHONG: [Zhi, Zhi][] = [
  ["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"],
];
export const LIUHE: [Zhi, Zhi][] = [
  ["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"],
];
// xing (punishment) full set per classics: sanxing three-punishment (yin-si-shen, chou-xu-wei) + huxing mutual (zi-mao) + zixing self-punishment (chen wu you hai, same element)
export const XING: [Zhi, Zhi][] = [
  ["寅", "巳"], ["巳", "申"], ["申", "寅"],
  ["丑", "戌"], ["戌", "未"], ["未", "丑"],
  ["子", "卯"],
  ["辰", "辰"], ["午", "午"], ["酉", "酉"], ["亥", "亥"],
];
export const HAI: [Zhi, Zhi][] = [
  ["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"],
];

// Day-pillar calibration - idx60 = (noon JDN + 49) mod 60
// Calibrated against sxtwl (check 2000-01-01=wuwu, 2024-01-01=jiazi) - do not change without running tests
export const DAY_PILLAR_OFFSET = 49;

// Chinese characters for the five elements
export const EL_CN: Record<ElementTH, string> = {
  ไม้: "木", ไฟ: "火", ดิน: "土", ทอง: "金", น้ำ: "水",
};

// Element of each earthly branch (used both as the branch element and the month's seasonal element)
export const BRANCH_EL: Record<Zhi, ElementTH> = {
  子: "น้ำ", 丑: "ดิน", 寅: "ไม้", 卯: "ไม้", 辰: "ดิน", 巳: "ไฟ",
  午: "ไฟ", 未: "ดิน", 申: "ทอง", 酉: "ทอง", 戌: "ดิน", 亥: "น้ำ",
};

// Chinese characters for the pillar headers, keyed by Thai label
export const HEAD_CN: Record<"ปี" | "เดือน" | "วัน" | "เวลา", string> = {
  ปี: "年", เดือน: "月", วัน: "日", เวลา: "時",
};

// -- Almanac extensions (canon, verified in masterdata.test) --

// NaYin 30 pairs (index = floor(position in the 60 jiazi cycle / 2)) -> [Chinese name, Thai name, element]
export const NAYIN: readonly [string, string, ElementTH][] = [
  ["海中金", "ทองกลางทะเล", "ทอง"], ["爐中火", "ไฟในเตา", "ไฟ"],
  ["大林木", "ไม้ป่าใหญ่", "ไม้"], ["路旁土", "ดินริมทาง", "ดิน"],
  ["劍鋒金", "ทองคมดาบ", "ทอง"], ["山頭火", "ไฟยอดเขา", "ไฟ"],
  ["澗下水", "น้ำใต้เหว", "น้ำ"], ["城頭土", "ดินกำแพงเมือง", "ดิน"],
  ["白蠟金", "ทองขี้ผึ้งขาว", "ทอง"], ["楊柳木", "ไม้หลิว", "ไม้"],
  ["泉中水", "น้ำในธาร", "น้ำ"], ["屋上土", "ดินบนหลังคา", "ดิน"],
  ["霹靂火", "ไฟอสนีบาต", "ไฟ"], ["松柏木", "ไม้สนไซเปรส", "ไม้"],
  ["長流水", "น้ำสายยาว", "น้ำ"], ["沙中金", "ทองในทราย", "ทอง"],
  ["山下火", "ไฟเชิงเขา", "ไฟ"], ["平地木", "ไม้ที่ราบ", "ไม้"],
  ["壁上土", "ดินบนผนัง", "ดิน"], ["金箔金", "ทองแผ่นเปลว", "ทอง"],
  ["覆燈火", "ไฟครอบตะเกียง", "ไฟ"], ["天河水", "น้ำธารสวรรค์", "น้ำ"],
  ["大驛土", "ดินทางหลวง", "ดิน"], ["釵釧金", "ทองปิ่นกำไล", "ทอง"],
  ["桑柘木", "ไม้หม่อน", "ไม้"], ["大溪水", "น้ำลำธารใหญ่", "น้ำ"],
  ["沙中土", "ดินในทราย", "ดิน"], ["天上火", "ไฟกลางหาว", "ไฟ"],
  ["石榴木", "ไม้ทับทิม", "ไม้"], ["大海水", "น้ำมหาสมุทร", "น้ำ"],
];

// Shi'er changsheng (twelve life stages): the "changsheng" branch of each heavenly stem (huotu tonggong school) - direction follows polarity (yang forward / yin reverse)
export const CHANGSHENG_START: Record<Gan, Zhi> = {
  甲: "亥", 丙: "寅", 戊: "寅", 庚: "巳", 壬: "申",
  乙: "午", 丁: "酉", 己: "酉", 辛: "子", 癸: "卯",
};
export const CHANGSHENG_NAMES: readonly string[] = [
  "เกิด (長生)", "อาบน้ำ (沐浴)", "สวมมงคล (冠帶)", "เข้ารับตำแหน่ง (臨官)",
  "รุ่งโรจน์ (帝旺)", "ถดถอย (衰)", "เจ็บป่วย (病)", "ดับ (死)",
  "สุสาน (墓)", "สิ้นสูญ (絕)", "ตั้งครรภ์ (胎)", "ฟูมฟัก (養)",
];

// kongwang / xunkong (void): xun index (floor(position in 60 / 10)) -> the 2 "void" branches
export const VOID_BY_XUN: readonly [Zhi, Zhi][] = [
  ["戌", "亥"], ["申", "酉"], ["午", "未"], ["辰", "巳"], ["寅", "卯"], ["子", "丑"],
];

// ShenSha (symbolic stars) - keyed by day stem (tianyi-guiren/lushen/wenchang/yangren) - keyed by day branch (jiangxing/taohua/yima/huagai)
export const TIANYI: Record<Gan, [Zhi, Zhi]> = {
  甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
  乙: ["子", "申"], 己: ["子", "申"],
  丙: ["亥", "酉"], 丁: ["亥", "酉"],
  壬: ["卯", "巳"], 癸: ["卯", "巳"], 辛: ["寅", "午"],
};
export const LUSHEN: Record<Gan, Zhi> = {
  甲: "寅", 乙: "卯", 丙: "巳", 戊: "巳", 丁: "午",
  己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子",
};
export const WENCHANG: Record<Gan, Zhi> = {
  甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申",
  己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯",
};
export const YANGREN: Partial<Record<Gan, Zhi>> = {
  甲: "卯", 丙: "午", 戊: "午", 庚: "酉", 壬: "子",
};
export const TAOHUA: Record<Zhi, Zhi> = {
  申: "酉", 子: "酉", 辰: "酉", 寅: "卯", 午: "卯", 戌: "卯",
  巳: "午", 酉: "午", 丑: "午", 亥: "子", 卯: "子", 未: "子",
};
export const YIMA: Record<Zhi, Zhi> = {
  申: "寅", 子: "寅", 辰: "寅", 寅: "申", 午: "申", 戌: "申",
  巳: "亥", 酉: "亥", 丑: "亥", 亥: "巳", 卯: "巳", 未: "巳",
};
export const HUAGAI: Record<Zhi, Zhi> = {
  申: "辰", 子: "辰", 辰: "辰", 寅: "戌", 午: "戌", 戌: "戌",
  巳: "丑", 酉: "丑", 丑: "丑", 亥: "未", 卯: "未", 未: "未",
};
export const JIANGXING: Record<Zhi, Zhi> = {
  申: "子", 子: "子", 辰: "子", 寅: "午", 午: "午", 戌: "午",
  巳: "酉", 酉: "酉", 丑: "酉", 亥: "卯", 卯: "卯", 未: "卯",
};
// Thai labels of the ShenSha (key order = display order) - meanings live in content/th.json
export const SHENSHA_TH: Record<string, string> = {
  天乙貴人: "เทียนอี่กุ้ยเหริน (ผู้อุปถัมภ์)",
  祿神: "ลู่เสิน (ลาภยศ)",
  文昌: "เหวินชาง (ดาววิชาการ)",
  將星: "เจียงซิง (ดาวขุนพล)",
  桃花: "เถาฮวา (ดอกท้อ)",
  驛馬: "อี้หม่า (ม้าเดินทาง)",
  華蓋: "หัวก้าย (ฉัตรพรสวรรค์)",
  羊刃: "หยางเริ่น (คมดาบ)",
};

// sanhe (three-harmony -> transformed element) - the middle [1] is the peak (wang) branch (used to judge banhe half-harmony)
export const SANHE: readonly [Zhi, Zhi, Zhi, ElementTH][] = [
  ["申", "子", "辰", "น้ำ"], ["亥", "卯", "未", "ไม้"],
  ["寅", "午", "戌", "ไฟ"], ["巳", "酉", "丑", "ทอง"],
];
// sanhui (three-meeting by direction/season -> dominant element)
export const SANHUI: readonly [Zhi, Zhi, Zhi, ElementTH][] = [
  ["寅", "卯", "辰", "ไม้"], ["巳", "午", "未", "ไฟ"],
  ["申", "酉", "戌", "ทอง"], ["亥", "子", "丑", "น้ำ"],
];
// tiangan wuhe (heavenly stems pair up -> the element they transform into)
export const TIANGAN_HE: readonly [Gan, Gan, ElementTH][] = [
  ["甲", "己", "ดิน"], ["乙", "庚", "ทอง"], ["丙", "辛", "น้ำ"],
  ["丁", "壬", "ไม้"], ["戊", "癸", "ไฟ"],
];
