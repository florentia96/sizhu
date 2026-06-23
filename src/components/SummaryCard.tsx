import type { Reading } from "../lib/reading";

// TL;DR summary panel - the result heading is an <h1> (the most important point of the result page)
export function SummaryCard({ reading, delay }: { reading: Reading; delay: number }) {
  return (
    <div className="reveal" style={{ animationDelay: `${delay}s` }}>
      <section className="tldr" aria-label="สรุปดวงอย่างย่อ">
        <div className="tldr-eyebrow">อ่านสรุปเร็ว · สำหรับคนรีบ</div>
        <h1 className="tldr-headline">{reading.headline}</h1>
        <div className="tldr-sub">{reading.headlineSub}</div>
        <div className="tldr-rows">
          {reading.tldr.map((row) => (
            <div className="tldr-row" key={row.label}>
              <span
                className="tldr-dot"
                style={{ background: row.color, boxShadow: `0 0 9px ${row.color}` }}
                aria-hidden="true"
              />
              <div>
                <span className="tldr-label">{row.label}</span>
                <span className="tldr-value">{row.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="tldr-foot">เลื่อนลงเพื่ออ่านแบบละเอียดทุกหัวข้อ ↓</div>
      </section>
    </div>
  );
}
