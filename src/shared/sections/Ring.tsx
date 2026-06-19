const R = 66;
const CX = 75;
const CY = 75;
const STROKE = 11;
const CIRC = 2 * Math.PI * R;

export function Ring({ pct, color }: { pct: number; color: string }) {
  const dash = (CIRC * Math.max(0, Math.min(100, pct))) / 100;
  return (
    <svg
      viewBox="0 0 150 150"
      width="100%"
      height="100%"
      role="img"
      aria-hidden="true"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={STROKE} />
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={String(CIRC)}
        strokeDashoffset={String(CIRC - dash)}
      />
    </svg>
  );
}
