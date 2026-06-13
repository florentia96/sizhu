import type { Reading } from "../lib/reading";

export function TenGodsPanel({ reading }: { reading: Reading }) {
  return (
    <>
      <p className="tg-intro">
        “สิบเทพ” คือความสัมพันธ์ระหว่างธาตุตัวเรากับธาตุอื่นในดวง บอกถึงนิสัยและด้านของชีวิตที่โดดเด่น เรียงจากที่พบบ่อยที่สุด
      </p>
      <div className="tg-list">
        {reading.tenGods.map((g) => (
          <div className="tg-item" key={g.cn}>
            <span className="tg-cn" aria-hidden="true">{g.cn}</span>
            <div>
              <div className="tg-name">
                {g.name} <span className="tg-meta">× {g.count} · กลุ่ม{g.group}</span>
              </div>
              <div className="tg-desc">{g.meaning}</div>
            </div>
          </div>
        ))}
      </div>
      {reading.relations.length > 0 && (
        <div className="rel-block">
          <h3 className="rel-head">
            <span className="mk" aria-hidden="true">支</span> ปฏิสัมพันธ์ระหว่างเสา
          </h3>
          {reading.relations.map((r) => (
            <p className="rel-item" key={r.label}>
              <b>{r.label}</b> <span className="pairs">({r.pairs})</span> — {r.meaning}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
