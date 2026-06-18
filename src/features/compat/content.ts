// ธาตุที่ส่งเสริมกัน (ตาม moodee-lib compatReport: elGood)
export const EL_HARMONY: Record<string, string> = {
  ไฟ: "ลม",
  ลม: "ไฟ",
  น้ำ: "ดิน",
  ดิน: "น้ำ",
};

export const SYNASTRY_NOTE: Record<string, { th: string; tone: "good" | "warn" | "info" }> = {
  conjunction: { th: "ดาวร่วม (Conjunction)", tone: "info" },
  sextile: { th: "ส่งเสริม 60° (Sextile)", tone: "good" },
  square: { th: "ท้าทาย 90° (Square)", tone: "warn" },
  trine: { th: "เกื้อหนุน 120° (Trine)", tone: "good" },
  opposition: { th: "ดึงดูด/ตึงเครียด 180° (Opposition)", tone: "warn" },
};

export const PLANET_TH: Record<string, string> = {
  Sun: "อาทิตย์", Moon: "จันทร์", Mercury: "พุธ", Venus: "ศุกร์",
  Mars: "อังคาร", Jupiter: "พฤหัส", Saturn: "เสาร์",
};
