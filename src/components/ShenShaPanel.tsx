import type { Reading } from "../lib/reading";

export function ShenShaPanel({ reading }: { reading: Reading }) {
  if (!reading.shenSha.length) {
    return <p className="ss-empty">ดวงนี้ไม่พบดาวสัญลักษณ์ในชุดหลักที่ตรวจ</p>;
  }
  return (
    <div className="ss-list">
      {reading.shenSha.map((s) => (
        <div className="ss-item" key={s.cn}>
          <div className="ss-head">
            <span className="ss-cn" aria-hidden="true">{s.cn}</span>
            <b className="ss-name">{s.name}</b>
            <span className="ss-where">เสา{s.where}</span>
          </div>
          <div className="ss-desc">{s.meaning}</div>
        </div>
      ))}
    </div>
  );
}
