import type { Section } from "../types";
import { CardSurface } from "./CardSurface";
import { CardHeader } from "./CardHeader";

type Grid = Extract<Section, { kind: "grid" }>;

export function GridCard({ section, accent }: { section: Grid; accent: string }) {
  const a = section.accent ?? accent;
  return (
    <CardSurface>
      <CardHeader glyph={section.glyph} title={section.title} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(152px,1fr))", gap: 11 }}>
        {section.cells.map((c, i) => (
          <div
            key={i}
            style={{
              background: "var(--surface-inset)",
              border: "1px solid var(--border-gold)",
              borderRadius: "var(--radius-input)",
              padding: 14,
            }}
          >
            <div style={{ fontSize: ".76rem", color: "var(--text-dim)" }}>{c.name}</div>
            <div style={{ fontFamily: "'Anuphan',system-ui,sans-serif", fontWeight: 600, fontSize: "1.02rem", marginTop: 4, color: a }}>
              {c.value}
            </div>
            {c.note && <div style={{ fontSize: ".74rem", color: "var(--text-faint)", marginTop: 3, lineHeight: 1.45 }}>{c.note}</div>}
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
