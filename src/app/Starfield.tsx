const BASE_STYLE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  backgroundImage:
    "radial-gradient(circle at 50% -8%, var(--bg-grad-top) 0, var(--bg) 52%)",
};

const STAR_LAYER =
  "radial-gradient(1px 1px at 18% 12%,rgba(255,255,255,.5),transparent)," +
  "radial-gradient(1px 1px at 72% 8%,rgba(255,255,255,.4),transparent)," +
  "radial-gradient(1.4px 1.4px at 86% 20%,rgba(255,236,200,.5),transparent)," +
  "radial-gradient(1px 1px at 38% 22%,rgba(255,255,255,.35),transparent)," +
  "radial-gradient(1px 1px at 58% 34%,rgba(255,255,255,.3),transparent)," +
  "radial-gradient(1px 1px at 8% 30%,rgba(255,255,255,.3),transparent)," +
  "radial-gradient(1.3px 1.3px at 90% 56%,rgba(255,236,200,.4),transparent)," +
  "radial-gradient(1px 1px at 28% 62%,rgba(255,255,255,.28),transparent)," +
  "radial-gradient(1px 1px at 48% 82%,rgba(255,255,255,.26),transparent)," +
  "radial-gradient(1px 1px at 78% 88%,rgba(255,255,255,.24),transparent)";

const STAR_STYLE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  backgroundImage: STAR_LAYER,
  animation: "twinkle 5s ease-in-out infinite",
};

export function Starfield() {
  return (
    <>
      <div aria-hidden style={BASE_STYLE} />
      <div aria-hidden style={STAR_STYLE} />
    </>
  );
}
