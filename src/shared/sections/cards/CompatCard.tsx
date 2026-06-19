import type { Section } from "../types";
import { Ring } from "../Ring";
import { CardSurface } from "./CardSurface";

type Compat = Extract<Section, { kind: "compat" }>;

function Avatar({ glyph, color }: { glyph: string; color: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--surface-inset)",
        border: `1px solid ${color}`,
        color,
        display: "grid",
        placeItems: "center",
        fontFamily: "'Noto Serif SC',serif",
        fontWeight: 700,
        fontSize: "1.3rem",
        margin: "0 auto",
      }}
    >
      {glyph}
    </div>
  );
}

export function CompatCard({ section, accent }: { section: Compat; accent: string }) {
  const a = section.accent ?? accent;
  return (
    <CardSurface pad={30} style={{ textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar glyph="甲" color={a} />
          <div style={{ fontSize: ".8rem", color: "var(--text-dim)", marginTop: 7 }}>{section.a}</div>
        </div>
        <div style={{ position: "relative", width: 150, height: 150 }}>
          <Ring pct={section.score} color={a} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: "2.3rem", color: a, lineHeight: 1 }}>
                {section.score}%
              </div>
              <div style={{ fontSize: ".72rem", color: "var(--text-dim)" }}>เข้ากัน</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Avatar glyph="乙" color={a} />
          <div style={{ fontSize: ".8rem", color: "var(--text-dim)", marginTop: 7 }}>{section.b}</div>
        </div>
      </div>
      <div
        style={{
          display: "inline-flex",
          background: "var(--surface-inset)",
          border: `1px solid ${a}`,
          color: a,
          padding: "7px 19px",
          borderRadius: 20,
          fontFamily: "'Anuphan',system-ui,sans-serif",
          fontWeight: 600,
          fontSize: "1.02rem",
          margin: "8px 0 4px",
        }}
      >
        {section.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left", marginTop: 16 }}>
        {section.points.map((pt, i) => (
          <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
            <span
              aria-hidden="true"
              style={{ width: 9, height: 9, borderRadius: "50%", marginTop: 7, flexShrink: 0, background: pt.fg, boxShadow: `0 0 9px ${pt.fg}` }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: ".92rem", color: pt.fg }}>{pt.title}</div>
              <div style={{ fontSize: ".87rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.55 }}>{pt.meaning}</div>
            </div>
          </div>
        ))}
      </div>
    </CardSurface>
  );
}
