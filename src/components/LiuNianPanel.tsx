import type { AnnualItem } from "../lib/reading";

const KIND_COLOR: Record<string, string> = {
  ส่งเสริม: "#6cc18a",
  ตั้งหลัก: "#e6b85a",
  ทั่วไป: "#7a7466",
};

export function LiuNianPanel({ annual }: { annual: AnnualItem[] }) {
  return (
    <>
      <p className="ln-intro">
        แต่ละปีธาตุของปีปะทะหรือส่งเสริมดวงเดิมต่างกัน (ก้านปีเปลี่ยนจริงที่ 立春 ราว 4 ก.พ. · อายุนับตามวันเกิดจริง)
      </p>
      <div className="ln-grid">
        {annual.map((a) => (
          <div className="ln-row" key={a.year} style={{ borderLeft: `3px solid ${a.elColor}` }}>
            <span className="ln-year">
              {a.year} <small>อายุ {a.age}</small>
            </span>
            <span className="ln-gz" style={{ color: a.elColor }}>{a.gz}</span>
            <span className="ln-tg">{a.tg}</span>
            <span className="ln-kind" style={{ color: KIND_COLOR[a.kind] }}>{a.kind}</span>
            {a.relations.length > 0 && <span className="ln-rel">{a.relations.join(", ")}</span>}
          </div>
        ))}
      </div>
    </>
  );
}
