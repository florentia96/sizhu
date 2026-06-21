import type { CSSProperties } from "react";
import type { GroupId } from "../app/feature";
import { GROUPS } from "./groups";

export type GroupFilter = GroupId | "all";

const WRAP: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--tap-gap, 8px)",
  margin: "36px 0 6px",
};

const chip = (activeColor: string | null): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: "var(--tap-min, 46px)",
  padding: "8px 16px",
  borderRadius: "var(--radius-pill, 999px)",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: ".9rem",
  color: activeColor ? "var(--text-strong)" : "var(--text-muted)",
  background: activeColor ? `color-mix(in srgb, ${activeColor} 16%, var(--surface))` : "var(--surface-inset)",
  border: `1.5px solid ${activeColor ? activeColor : "var(--border-gold)"}`,
  transition: "color .15s ease, border-color .15s ease, background .15s ease",
});

const GLYPH: CSSProperties = { fontFamily: "var(--font-cn, serif)", fontSize: "1.05rem", lineHeight: 1 };
const COUNT: CSSProperties = { fontSize: ".74rem", opacity: 0.7 };

export function CategoryNav({
  active,
  onPick,
  counts,
}: {
  active: GroupFilter;
  onPick: (g: GroupFilter) => void;
  counts: Record<GroupId, number>;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const groups = GROUPS.filter((g) => (counts[g.id] ?? 0) > 0);

  return (
    <nav style={WRAP} aria-label="หมวดศาสตร์">
      <button
        type="button"
        aria-pressed={active === "all"}
        onClick={() => onPick("all")}
        style={chip(active === "all" ? "var(--gold, #d8a64a)" : null)}
      >
        ทั้งหมด <span style={COUNT}>{total}</span>
      </button>
      {groups.map((g) => {
        const on = active === g.id;
        return (
          <button
            key={g.id}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(g.id)}
            style={chip(on ? g.color : null)}
          >
            <span style={{ ...GLYPH, color: g.color }}>{g.cn}</span>
            {g.title} <span style={COUNT}>{counts[g.id]}</span>
          </button>
        );
      })}
    </nav>
  );
}
