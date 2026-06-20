import "../styles/app.css";

// พิธีเปิดดวง — แตะที่ใดก็ได้เพื่อข้ามไปหน้าผลทันที
// ใช้ได้ทุก feature: ปรับ glyph/ข้อความได้ตามศาสตร์ (ค่าเริ่มต้นเป็นของปาจื้อ)
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
