// กาลโยค (gala-yok) วันธงชัย/อธิบดี/อุบาทว์/โลกาวินาศ + ดิถี (lunar phase)
// สูตรกาลโยคจากจุลศักราช (จ.ศ.) — ที่มา:
//   th.wikipedia.org/wiki/กาลโยค + topicstock.pantip.com/.../Y10182445
//   ตรวจกับโหรรัตนโกสินทร์ พ.ศ.2568 (horoscope.kapook.com/view289786.html)
// ดิถี = lunar age จาก mean synodic month 29.530588853 วัน (NASA mean lunation)

export type KalaClass = "ธงชัย" | "อธิบดี" | "อุบาทว์" | "โลกาวินาศ";

/** Gregorian → Julian Day Number (proleptic Gregorian, noon-based) */
export function gregorianToJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

/**
 * จุลศักราชของเดือน/ปี ค.ศ. ที่กำหนด
 * จ.ศ. = พ.ศ. − 1181 = (ค.ศ. + 543) − 1181 = ค.ศ. − 638
 * เปลี่ยนจ.ศ. ที่สงกรานต์ (ประมาณ 16 เม.ย.) — เดือน ม.ค.–มี.ค. ยังเป็นจ.ศ.ปีก่อน
 * สมมติฐาน (NO MAGIC): ใช้วันที่ 16 เม.ย. เป็นเส้นแบ่งคงที่ (ไม่คิดสงกรานต์ดาราศาสตร์รายปี)
 */
export function chulaSakaratForMonth(yearCE: number, month: number): number {
  const base = yearCE - 638;
  return month < 4 ? base - 1 : base;
}

/**
 * วันในสัปดาห์ของกาลโยคทั้ง 4 (0=อาทิตย์ … 6=เสาร์)
 * เกณฑ์ตามตำรา → เศษ mod 7 (เศษ 1=อาทิตย์ … 0=เสาร์) แปลงเป็น 0-based ด้วย (r+6)%7
 */
export function kalaWeekdays(cs: number): Record<KalaClass, number> {
  const toWeekday = (criterion: number): number => {
    const r = ((criterion % 7) + 7) % 7; // เศษ 1..6,0 (0=เสาร์)
    return (r + 6) % 7; // 1→0(อาทิตย์) … 0→6(เสาร์)
  };
  return {
    ธงชัย: toWeekday(cs * 10 + 3),
    อธิบดี: toWeekday(((cs % 498) + 498) % 498),
    อุบาทว์: toWeekday(cs * 10 + 2),
    โลกาวินาศ: toWeekday(cs + 1120),
  };
}

const SYNODIC = 29.530588853;
// new-moon epoch: 2000-01-06 18:14 UT ≈ JD 2451550.26 (NASA reference new moon)
const NEWMOON_EPOCH_JD = 2451550.26;

/**
 * ดิถี / lunar phase ณ JDN ที่กำหนด
 * age = อายุดวงจันทร์ (0=เดือนดับ) · waxing=ข้างขึ้น (age<half) · dithi=ค่ำที่ (1..15 ขึ้น/แรม)
 */
export function lunarPhase(jdn: number): {
  age: number;
  waxing: boolean;
  dithi: number;
} {
  const age = (((jdn - NEWMOON_EPOCH_JD) % SYNODIC) + SYNODIC) % SYNODIC;
  const waxing = age < SYNODIC / 2;
  const dayInHalf = Math.floor(age % (SYNODIC / 2)) + 1; // 1..15
  return { age, waxing, dithi: Math.min(15, dayInHalf) };
}
