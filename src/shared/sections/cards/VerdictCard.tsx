import type { Section } from "../types";
import { Ring } from "../Ring";
import { CardSurface } from "./CardSurface";

type Verdict = Extract<Section, { kind: "verdict" }>;

export function VerdictCard({ section, accent }: { section: Verdict; accent: string }) {
  const a = section.accent ?? accent;
  const showRing = !section.hideRing;
  return (
    <CardSurface
      accentLeft={a}
      pad={28}
      style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}
    >
      {showRing && (
        <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
          <Ring pct={section.score} color={a} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div>
              <div style={{ fontFamily: "'Noto Serif SC',serif", fontWeight: 700, fontSize: "2.7rem", lineHeight: 1, color: a }}>
                {section.score}
              </div>
              <div style={{ fontSize: ".72rem", color: "var(--text-dim)", marginTop: 3 }}>/ 100 คะแนน</div>
            </div>
          </div>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: ".72rem", letterSpacing: ".28em", textTransform: "uppercase", color: a, fontWeight: 600, marginBottom: 10 }}>
          ผลวิเคราะห์
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface-inset)",
            border: `1px solid ${a}`,
            color: a,
            padding: "6px 15px",
            borderRadius: 20,
            fontWeight: 600,
            fontFamily: "'Noto Serif Thai',serif",
            fontSize: "1rem",
          }}
        >
          {section.grade} · {section.gradeLabel}
        </div>
        <p style={{ margin: "13px 0 0", fontSize: ".95rem", lineHeight: 1.7, color: "var(--text)" }}>{section.summary}</p>
        {section.meta && <div style={{ fontSize: ".74rem", color: "var(--text-faint)", marginTop: 9 }}>{section.meta}</div>}
      </div>
    </CardSurface>
  );
}
