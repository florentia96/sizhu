import type { Reading } from "../lib/reading";

export function TipsPanel({ reading }: { reading: Reading }) {
  const t = reading.tips;
  return (
    <>
      <div className="tip-grid">
        <div className="tip">
          <div className="tip-label">สีมงคล (เสริมธาตุที่ขาด)</div>
          <div className="tip-val tip-colors">
            {t.colors.map((c) => (
              <span className="tip-color" key={c.el}>
                <span
                  className="tip-dot"
                  style={{ background: c.swatch, boxShadow: `0 0 8px ${c.swatch}` }}
                  aria-hidden="true"
                />
                {c.color}
              </span>
            ))}
          </div>
        </div>
        <div className="tip">
          <div className="tip-label">ทิศมงคล</div>
          <div className="tip-val">{t.dirs}</div>
        </div>
        <div className="tip">
          <div className="tip-label">สายงานที่เหมาะ (ตามธาตุเสริม)</div>
          <div className="tip-val">{t.fields}</div>
        </div>
        <div className="tip">
          <div className="tip-label">อาชีพตามสิบเทพเด่น (กลุ่ม{t.careerGroup})</div>
          <div className="tip-val">{t.careerText}</div>
        </div>
        <div className="tip">
          <div className="tip-label">กิจกรรมเสริมพลัง</div>
          <div className="tip-val">{t.acts}</div>
        </div>
        <div className="tip">
          <div className="tip-label">ดูแลตัวเองตามธาตุ</div>
          <div className="tip-val">
            ธาตุ{" "}
            <span style={{ color: t.weakColor, fontWeight: 600 }}>
              {t.weakElCn} {t.weakEl}
            </span>{" "}
            มีน้อยในดวง ตามคติแพทย์จีนเชื่อมโยงกับ{t.organ} ควรพักผ่อน อาหารสมดุล และออกกำลังสม่ำเสมอ
          </div>
        </div>
      </div>
      <div className="disclaimer">
        สี/ทิศ/อาชีพเป็นแนวทางเสริมเชิงสัญลักษณ์ · เรื่องสุขภาพเป็นคติโบราณ ไม่ใช่คำวินิจฉัยทางการแพทย์
      </div>
    </>
  );
}
