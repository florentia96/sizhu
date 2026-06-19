import type { Section } from "../types";
import { CardSurface } from "./CardSurface";
import { CardHeader } from "./CardHeader";

type Blocks = Extract<Section, { kind: "blocks" }>;

export function BlocksCard({ section }: { section: Blocks }) {
  return (
    <CardSurface>
      <CardHeader glyph={section.glyph} title={section.title} />
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {section.items.map((bl, i) => (
          <div
            key={i}
            style={{
              borderLeft: `4px solid ${bl.accent}`,
              background: "var(--surface-inset)",
              borderRadius: "0 6px 6px 0",
              padding: "15px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "'Noto Serif Thai',serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-strong)" }}>
                {bl.title}
              </div>
              <span
                style={{
                  fontSize: ".68rem",
                  fontWeight: 600,
                  padding: "3px 11px",
                  borderRadius: 20,
                  background: "var(--surface-inset)",
                  border: `1px solid ${bl.accent}`,
                  color: bl.accent,
                }}
              >
                {bl.tag}
              </span>
            </div>
            <p style={{ margin: "0 0 11px", fontSize: ".88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{bl.text}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {bl.chips.map((ch, j) => (
                <span
                  key={j}
                  style={{
                    fontFamily: "'Noto Serif Thai',serif",
                    fontWeight: 500,
                    fontSize: ".92rem",
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: "var(--surface-inset)",
                    border: `1px solid ${bl.accent}`,
                    color: bl.accent,
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
