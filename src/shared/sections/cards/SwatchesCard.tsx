import type { Section } from "../types";
import { CardSurface } from "./CardSurface";

type Swatches = Extract<Section, { kind: "swatches" }>;

export function SwatchesCard({ section, accent }: { section: Swatches; accent: string }) {
  const a = section.accent ?? accent;
  return (
    <CardSurface>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
        <div
          style={{
            fontFamily: "'Anuphan',system-ui,sans-serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--text-strong)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            lineHeight: 1.3,
          }}
        >
          <span style={{ fontFamily: "'Noto Serif SC',serif", color: a, flexShrink: 0 }}>{section.glyph}</span>
          <span>{section.title}</span>
        </div>
        {section.tag && (
          <span
            style={{
              fontSize: ".68rem",
              fontWeight: 600,
              padding: "3px 11px",
              borderRadius: 20,
              background: "var(--surface-inset)",
              border: `1px solid ${a}`,
              color: a,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {section.tag}
          </span>
        )}
      </div>
      {section.text && (
        <p style={{ margin: "0 0 16px", fontSize: ".88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{section.text}</p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
        {section.items.map((sw, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div
              data-swatch={sw.name}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: sw.hex,
                border: "2px solid var(--border-gold)",
                boxShadow: "var(--shadow-sm)",
              }}
            />
            <span style={{ fontSize: ".82rem", color: "var(--text)", fontWeight: 500 }}>{sw.name}</span>
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
