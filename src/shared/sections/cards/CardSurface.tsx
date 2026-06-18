import type React from "react";

export function CardSurface({
  children,
  accentLeft,
  pad = 24,
  style,
}: {
  children: React.ReactNode;
  accentLeft?: string;
  pad?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-gold)",
        borderLeft: accentLeft ? `4px solid ${accentLeft}` : undefined,
        borderRadius: "var(--radius-card)",
        padding: pad,
        boxShadow: "var(--shadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
