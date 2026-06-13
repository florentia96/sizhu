// พิธีเปิดดวง — แตะที่ใดก็ได้เพื่อข้ามไปหน้าผลทันที
export function CastingScreen({ onSkip }: { onSkip: () => void }) {
  return (
    <button type="button" className="casting" onClick={onSkip} aria-label="กำลังเปิดดวง แตะเพื่อข้าม">
      <div className="orb" aria-hidden="true">
        <span className="orb-ring" />
        <span className="orb-ring" />
        <span className="orb-ring" />
        <span className="orb-glyph">卜</span>
      </div>
      <div className="casting-text">กำลังเปิดดวง…</div>
      <div className="casting-sub">เรียงสี่เสา · นับห้าธาตุ · ทอดต้าอวิ้น</div>
    </button>
  );
}
