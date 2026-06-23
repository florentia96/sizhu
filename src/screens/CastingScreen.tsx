import "../styles/app.css";

// The casting ceremony - tap anywhere to skip straight to the result page
// Works for every feature: glyph/text can be adjusted per discipline (defaults are BaZi's)
export function CastingScreen({
  onSkip,
  glyph = "卜",
  text = "กำลังเปิดดวง…",
  sub = "เรียงสี่เสา นับห้าธาตุ ทอดต้าอวิ้น",
}: {
  onSkip: () => void;
  glyph?: string;
  text?: string;
  sub?: string;
}) {
  return (
    <button type="button" className="casting" onClick={onSkip} aria-label="กำลังเปิดดวง แตะเพื่อข้าม">
      <div className="orb" aria-hidden="true">
        <span className="orb-ring" />
        <span className="orb-ring" />
        <span className="orb-ring" />
        <span className="orb-glyph">{glyph}</span>
      </div>
      <div className="casting-text">{text}</div>
      <div className="casting-sub">{sub}</div>
    </button>
  );
}
