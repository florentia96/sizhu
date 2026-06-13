import type { ReadingPillar } from "../lib/reading";

// ผังสี่เสา 4×4 — gap:1px วาดเส้นแบ่ง · เสาวันไฮไลต์ + ป้าย 日主
export function ChartGrid({
  pillars,
  solarShift,
}: {
  pillars: ReadingPillar[];
  solarShift: number;
}) {
  return (
    <>
      <div className="fp-grid">
        {pillars.map((p) => (
          <div className={`fp fp-head${p.isDay ? " day" : ""}`} key={`h-${p.label}`}>
            <span className="head-cn" aria-hidden="true">{p.head}</span>
            <span className="head-th">{p.label}</span>
            {p.isDay && <span className="dm-tag">日主 ตัวเรา</span>}
          </div>
        ))}
        {pillars.map((p) => (
          <div className={`fp fp-cell${p.isDay ? " day" : ""}`} key={`s-${p.label}`}>
            <span className="fp-glyph" style={{ color: p.ganColor }}>{p.gan}</span>
            <span className="fp-eltag" style={{ background: p.ganColor }}>
              {p.ganElCn} {p.ganEl}
            </span>
            <span className="fp-tg">{p.ganTg}</span>
          </div>
        ))}
        {pillars.map((p) => (
          <div className={`fp fp-cell${p.isDay ? " day" : ""}`} key={`b-${p.label}`}>
            <span className="fp-glyph" style={{ color: p.zhiColor }}>{p.zhi}</span>
            <span className="fp-eltag" style={{ background: p.zhiColor }}>
              {p.zhiElCn} {p.zhiEl}
            </span>
            <span className="fp-zhi-th">
              {p.zhiTh} · {p.zodiac}
            </span>
          </div>
        ))}
        {pillars.map((p) => (
          <div className={`fp fp-hidden${p.isDay ? " day" : ""}`} key={`hid-${p.label}`}>
            <span className="hlabel">ก้านซ่อน</span>
            {p.hidden.map((h, i) => (
              <span className="hrow" key={i}>
                <b style={{ color: h.color }}>{h.gan}</b> {h.tg}
              </span>
            ))}
          </div>
        ))}
        {pillars.map((p) => (
          <div className={`fp fp-extra${p.isDay ? " day" : ""}`} key={`x-${p.label}`}>
            <span className="fp-ny" style={{ color: p.naYinColor }}>{p.naYinTh}</span>
            <span className="fp-cs">{p.changSheng}</span>
            {p.isVoid && <span className="fp-void">空亡 ว่าง</span>}
          </div>
        ))}
      </div>
      <div className="fp-legend">
        <div>納音 — ธาตุเสียงประจำเสา</div>
        <div>長生 — ช่วงพลังของวันเกิดเมื่ออยู่บนเสานั้น</div>
        <div>空亡 — เสาที่พลังพร่อง ของมงคลในเสานั้นลดทอนลง</div>
      </div>
      {solarShift !== 0 && (
        <div className="solar-note">
          ปรับเวลาสุริยคติจริง {solarShift > 0 ? "+" : ""}
          {solarShift} นาที สำหรับเลือกยาม
        </div>
      )}
    </>
  );
}
