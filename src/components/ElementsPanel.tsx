import type { Reading } from "../lib/reading";
import { WuXingDiagram } from "./WuXingDiagram";

export function ElementsPanel({ reading }: { reading: Reading }) {
  return (
    <>
      <div className="wux-wrap">
        <div className="wux-svg-box">
          <WuXingDiagram elements={reading.elements} />
        </div>
        <div className="bars">
          {reading.elementBars.map((b) => (
            <div className="bar" key={b.el}>
              <span className="bar-nm">
                <span className="c" style={{ color: b.color }}>{b.cn}</span> {b.el}
              </span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
              </span>
              <span className="bar-ct">{b.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chip-group">
        <div className="chip-label">ธาตุใช้เสริม (用神 โดยประมาณ)</div>
        <div className="chips">
          {reading.usefulChips.map((c) => (
            <span className="chip use" key={c.el} style={{ background: c.color }}>
              {c.cn} {c.el}
            </span>
          ))}
        </div>
      </div>
      <div className="chip-group">
        <div className="chip-label">ธาตุที่มีพออยู่แล้ว ใช้แต่พอดี (忌神 โดยประมาณ)</div>
        <div className="chips">
          {reading.avoidChips.map((c) => (
            <span className="chip avoid" key={c.el}>
              {c.cn} {c.el}
            </span>
          ))}
        </div>
      </div>
      <p className="tiaohou-note">{reading.tiaohou}</p>
    </>
  );
}
