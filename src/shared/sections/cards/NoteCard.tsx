import type { Section } from "../types";

type Note = Extract<Section, { kind: "note" }>;

export function NoteCard({ section }: { section: Note }) {
  return (
    <div
      role="note"
      style={{
        border: "1px dashed var(--border-gold)",
        borderRadius: "var(--radius-card)",
        padding: "14px 18px",
        background: "var(--surface-inset)",
        fontStyle: "italic",
        fontSize: ".8rem",
        color: "var(--text-dim)",
        lineHeight: 1.65,
      }}
    >
      {section.text}
    </div>
  );
}
