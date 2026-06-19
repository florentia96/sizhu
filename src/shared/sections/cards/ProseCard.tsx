import type { Section } from "../types";
import { CardSurface } from "./CardSurface";

type Prose = Extract<Section, { kind: "prose" }>;

export function ProseCard({ section, accent }: { section: Prose; accent: string }) {
  const a = section.accent ?? accent;
  return (
    <CardSurface>
      <div
        style={{
          fontFamily: "'Noto Serif Thai',serif",
          fontWeight: 600,
          fontSize: "1.05rem",
          color: "var(--text-strong)",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}
      >
        <span style={{ fontFamily: "'Noto Serif SC',serif", color: a }}>{section.glyph}</span> {section.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {section.paras.map((p, i) => (
          <div key={i}>
            {p.h && <div style={{ fontWeight: 600, fontSize: ".95rem", color: "var(--text-strong)", marginBottom: 3 }}>{p.h}</div>}
            <p style={{ margin: 0, fontSize: ".92rem", lineHeight: 1.75, color: "var(--text)" }}>{p.t}</p>
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
