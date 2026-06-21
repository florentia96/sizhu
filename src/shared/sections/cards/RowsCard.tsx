import type { Section } from "../types";
import { CardSurface } from "./CardSurface";
import { CardHeader } from "./CardHeader";

type Rows = Extract<Section, { kind: "rows" }>;

export function RowsCard({ section }: { section: Rows }) {
  return (
    <CardSurface>
      <CardHeader glyph={section.glyph} title={section.title} />
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {section.items.map((it, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              paddingBottom: 13,
              borderBottom: "1px solid var(--border-gold)",
            }}
          >
            <div
              style={{
                minWidth: 50,
                height: 50,
                padding: "0 9px",
                borderRadius: "var(--radius-sm)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                fontFamily: "'Noto Serif SC',serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                background: "var(--surface-inset)",
                border: `1px solid ${it.fg}`,
                color: it.fg,
              }}
            >
              {it.n}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: ".94rem", color: it.fg }}>{it.title}</div>
              <div style={{ fontSize: ".88rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.55 }}>{it.meaning}</div>
            </div>
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
