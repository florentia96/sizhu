import type { Section } from "../types";
import { CardSurface } from "./CardSurface";

type Cards = Extract<Section, { kind: "cards" }>;

export function CardsCard({ section, accent }: { section: Cards; accent: string }) {
  const a = section.accent ?? accent;
  return (
    <CardSurface>
      <div
        style={{
          fontFamily: "'Anuphan',system-ui,sans-serif",
          fontWeight: 600,
          fontSize: "1.05rem",
          color: "var(--text-strong)",
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}
      >
        <span style={{ fontFamily: "'Noto Serif SC',serif", color: "var(--gold)" }}>{section.glyph}</span> {section.title}
      </div>
      {section.subtitle && (
        <p style={{ margin: "6px 0 16px", fontSize: ".85rem", color: "var(--text-dim)", lineHeight: 1.55 }}>{section.subtitle}</p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(152px,1fr))",
          gap: 12,
          marginTop: section.subtitle ? 0 : 16,
        }}
      >
        {section.items.map((it, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--border-gold)",
              background: "var(--surface-inset)",
              borderRadius: "var(--radius-card)",
              padding: 16,
              position: "relative",
            }}
          >
            {it.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: ".66rem",
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: "var(--surface-inset)",
                  border: `1px solid ${a}`,
                  color: a,
                }}
              >
                {it.badge}
              </span>
            )}
            <div
              style={{
                fontFamily: "'Anuphan','Noto Serif SC',sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                letterSpacing: ".04em",
                color: "var(--text-strong)",
                marginTop: 4,
              }}
            >
              {it.value}
            </div>
            {it.note && <div style={{ fontSize: ".76rem", color: "var(--text-dim)", marginTop: 6 }}>{it.note}</div>}
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
