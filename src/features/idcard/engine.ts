import type { FeatureEngine } from "../../app/feature";
import { numberReport } from "../_shared/numerology";

// ประเภทเลข → ป้ายผล + ความยาวบังคับ (บัตรประชาชนไทย = 13 หลัก)
const TYPE_META: Record<string, { label: string; len?: number }> = {
  "บัตรประชาชน": { label: "เลขบัตรประชาชน", len: 13 },
  "เลขที่บ้าน": { label: "เลขที่บ้าน" },
  "เลขบัญชีธนาคาร": { label: "เลขบัญชีธนาคาร" },
};

export const idcardEngine: FeatureEngine = {
  build(vals: string[]) {
    const type = (vals[0] ?? "").trim();
    const raw = (vals[1] ?? "").trim();
    const m = TYPE_META[type] ?? { label: "เลข" };
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 2)
      return [{ kind: "note", text: "กรุณากรอกตัวเลขอย่างน้อย 2 หลักเพื่อวิเคราะห์" }];
    if (m.len && digits.length !== m.len)
      return [{ kind: "note", text: `${m.label}ต้องมี ${m.len} หลัก (กรอกมา ${digits.length} หลัก)` }];
    return numberReport(raw, m.label, "證");
  },
};
