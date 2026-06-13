import type { Reading, LuckKind } from "../lib/reading";

const KIND_COLOR: Record<LuckKind, string> = {
  ส่งเสริม: "#6cc18a",
  ตั้งหลัก: "#e6b85a",
  ทั่วไป: "#7a7466",
};

export function LuckPanel({ reading }: { reading: Reading }) {
  const { luck } = reading;
  return (
    <>
      <div className="luck-meta">
        ทิศเดิน: {luck.forward ? "เดินหน้า (順)" : "ถอยหลัง (逆)"} · เริ่มประมาณอายุ{" "}
        {luck.startAge.toFixed(1)} ปี
      </div>
      <div className="luck-grid">
        {luck.pillars.map((l, i) => (
          <div className="luck-card" key={i} style={{ borderTop: `3px solid ${l.color}` }}>
            <div className="luck-age">
              {l.from}–{l.to} ปี
            </div>
            <div className="luck-gz" style={{ color: l.color }}>{l.gz}</div>
            <div className="luck-tg">{l.tg}</div>
            <div className="luck-kind" style={{ color: KIND_COLOR[l.kind] }}>{l.kind}</div>
          </div>
        ))}
      </div>
      <p className="luck-para">{luck.para}</p>
    </>
  );
}
