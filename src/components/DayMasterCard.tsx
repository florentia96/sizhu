import type { Reading } from "../lib/reading";

export function DayMasterCard({ reading }: { reading: Reading }) {
  return (
    <>
      <div className="dm-row">
        <div
          className="dm-circle"
          style={{
            color: reading.dmColor,
            border: `2px solid ${reading.dmColor}`,
            boxShadow: `0 0 24px ${reading.dmColor}`,
          }}
        >
          {reading.dayMaster}
        </div>
        <div className="dm-meta">
          <div className="dm-name">{reading.natureName}</div>
          <div className="dm-pol">{reading.polarityNote}</div>
        </div>
      </div>
      <p className="dm-para">{reading.natureDesc}</p>
      <p className="dm-para">{reading.seasonPara}</p>
      <p className="dm-para">{reading.strengthPara}</p>
    </>
  );
}
