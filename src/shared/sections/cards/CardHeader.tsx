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
        fontFamily: "var(--font-head)",
        fontWeight: 500,
        fontSize: "1.1rem",
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
