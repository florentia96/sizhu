export function CardHeader({
  glyph,
  title,
  glyphColor = "var(--gold)",
}: {
  glyph: string;
  title: string;
  glyphColor?: string;
}) {
  return (
    <div
      style={{
        fontFamily: "'Anuphan',system-ui,sans-serif",
        fontWeight: 600,
        fontSize: "1.05rem",
        color: "var(--text-strong)",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <span style={{ fontFamily: "'Noto Serif SC',serif", color: glyphColor }}>{glyph}</span> {title}
    </div>
  );
}
