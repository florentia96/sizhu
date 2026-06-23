import type { FeatureEngine, Section } from "../../app/feature";
import { numberReport } from "../_shared/numerology";

// Number type -> result label + required length (Thai national ID = 13 digits)
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
      return [
        {
          kind: "note",
          text: `${m.label}ต้องมี ${m.len} หลักพอดี ตอนนี้กรอกมา ${digits.length} หลัก กรุณาตรวจสอบอีกครั้ง`,
        },
      ];
    if (!m.len && digits.length > 15)
      return [
        {
          kind: "note",
          text: `${m.label}รองรับสูงสุด 15 หลัก ตอนนี้กรอกมา ${digits.length} หลัก กรุณาตรวจสอบอีกครั้ง`,
        },
      ];
    const sections = numberReport(raw, m.label, "證");
    const typeNote: Section = {
      kind: "note",
      text: `ผลนี้วิเคราะห์จาก "${m.label}" ที่คุณเลือก โดยใช้หลักเลขศาสตร์เดียวกันทุกประเภทเลข หากต้องการตรวจเลขประเภทอื่น สามารถเปลี่ยนประเภทแล้ววิเคราะห์ใหม่ได้`,
    };
    return [typeNote, ...sections];
  },
};
