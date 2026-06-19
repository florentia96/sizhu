import type { CSSProperties } from "react";
import type { Section } from "../sections/types";
import { summarize } from "./buildShareText";

// palette "โลกกระดาษ" จากดีไซน์ระบบเดิม (tokens.css) — สว่าง คอนทราสต์ผ่าน WCAG AA
// ตั้งใจให้ต่างจาก shell มืดของแอป เพราะการ์ดนี้คือหน่วยที่ผู้ใช้แคปไปแชร์
const PAPER = "#efe7d0";
const PANEL = "#f6f0e0";
const INK = "#22262d";
const INK_SOFT = "#55564d";
const CINNABAR = "#b1352a";

const CARD: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  marginBottom: 14,
  padding: "clamp(20px,4vw,28px)",
  borderRadius: "var(--radius-card, 6px)",
  background: `linear-gradient(150deg, ${PANEL}, ${PAPER})`,
  border: "1px solid rgba(0,0,0,.08)",
  borderLeft: `4px solid ${CINNABAR}`,
  boxShadow: "0 12px 38px rgba(0,0,0,.5)",
};

const EYEBROW: CSSProperties = {
  fontSize: ".72rem",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: CINNABAR,
  fontWeight: 700,
  marginBottom: 8,
};

const NAME: CSSProperties = {
  fontFamily: "var(--font-head, 'Anuphan', system-ui, sans-serif)",
  fontWeight: 700,
  fontSize: "clamp(1.4rem,4.6vw,1.95rem)",
  lineHeight: 1.18,
  color: INK,
  margin: 0,
};

const HEADLINE: CSSProperties = {
  fontFamily: "var(--font-head, 'Anuphan', system-ui, sans-serif)",
  fontWeight: 600,
  fontSize: "clamp(1.02rem,3vw,1.22rem)",
  lineHeight: 1.4,
  color: INK,
  margin: "12px 0 0",
};

const SUB: CSSProperties = {
  fontSize: ".92rem",
  lineHeight: 1.55,
  color: INK_SOFT,
  margin: "7px 0 0",
};

const WATERMARK = (accent: string): CSSProperties => ({
  position: "absolute",
  right: "clamp(-8px,2vw,14px)",
  top: "50%",
  transform: "translateY(-50%)",
  fontFamily: "var(--font-cn, 'Noto Serif SC', serif)",
  fontSize: "clamp(96px,22vw,168px)",
  lineHeight: 1,
  color: accent,
  opacity: 0.14,
  pointerEvents: "none",
  userSelect: "none",
});

export function ResultHero({
  featureName,
  glyph,
  sections,
  accent,
}: {
  featureName: string;
  glyph: string;
  sections: Section[];
  accent: string;
}) {
  const lines = summarize(sections);
  const headline = lines[0] ?? "";
  const sub = lines[1] ?? "";

  return (
    <section style={CARD} aria-label="สรุปผลทำนาย">
      <span aria-hidden style={WATERMARK(accent)}>
        {glyph}
      </span>
      <div style={{ position: "relative" }}>
        <div style={EYEBROW}>MooDee · 神算 — ผลทำนาย</div>
        <h2 style={NAME}>{featureName}</h2>
        {headline && <p style={HEADLINE}>{headline}</p>}
        {sub && <p style={SUB}>{sub}</p>}
      </div>
    </section>
  );
}
