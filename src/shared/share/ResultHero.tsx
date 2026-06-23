import type { CSSProperties } from "react";
import type { Section } from "../sections/types";
import { summarize } from "./buildShareText";

// Result summary card (the unit users screenshot to share) - frosted glass + brand accent per theme, light/dark switchable
const CARD: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  marginBottom: 16,
  padding: "clamp(20px,4vw,28px)",
  borderRadius: "var(--radius-card)",
  background: "var(--surface)",
  backgroundImage: "linear-gradient(150deg, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)",
  border: "1px solid color-mix(in srgb, var(--primary) 22%, var(--border-gold))",
  borderLeft: "5px solid var(--primary)",
  backdropFilter: "blur(var(--glass-blur))",
  WebkitBackdropFilter: "blur(var(--glass-blur))",
  boxShadow: "var(--shadow)",
};

const EYEBROW: CSSProperties = {
  fontSize: ".72rem",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: "var(--primary)",
  fontWeight: 600,
  marginBottom: 8,
};

const NAME: CSSProperties = {
  fontFamily: "var(--font-head)",
  fontWeight: 500,
  fontSize: "clamp(1.4rem,4.6vw,1.95rem)",
  lineHeight: 1.18,
  color: "var(--ink)",
  margin: 0,
};

const HEADLINE: CSSProperties = {
  fontFamily: "var(--font-head)",
  fontWeight: 500,
  fontSize: "clamp(1.02rem,3vw,1.22rem)",
  lineHeight: 1.4,
  color: "var(--ink)",
  margin: "12px 0 0",
};

const SUB: CSSProperties = {
  fontSize: ".92rem",
  lineHeight: 1.55,
  color: "var(--ink-soft)",
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
