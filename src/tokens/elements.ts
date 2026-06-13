// [ถัง 4] สีธาตุทั้งห้าสำหรับ JS/SVG — โทนสว่าง (พื้นกระดาษ) และโทนมืด (พื้นหน้าผล)
import type { ElementTH } from "../types";

export const EL_HEX: Record<ElementTH, string> = {
  ไม้: "#3f7d54", ไฟ: "#c1352b", ดิน: "#c2901f", ทอง: "#7f7a6c", น้ำ: "#2f4a63",
};

export const EL_DARK: Record<ElementTH, string> = {
  ไม้: "#6cc18a", ไฟ: "#e8685c", ดิน: "#e6b85a", ทอง: "#cfc7b2", น้ำ: "#6fa6d6",
};
