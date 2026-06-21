import { ELEMENTS, type ElementTH } from "../types";
import { EL_CN, GEN, CTRL } from "../engine/constants";
import { EL_DARK } from "../tokens/elements";

// ไดอะแกรมห้าเหลี่ยม: ขอบนอก = วงจรเกิด (生) เส้นทอง · เส้นดาวใน = วงจรข่ม (克) เส้นแดง
// ขนาดโหนด = จำนวนธาตุในดวง
// วงจร 生/克 derive จาก GEN/CTRL ของ engine — เป็น single source of truth ลำดับ ELEMENTS เปลี่ยนเส้นก็ตามถูกเอง
const eIdx = (e: ElementTH): number => ELEMENTS.indexOf(e);
export const SHENG: readonly [number, number][] = ELEMENTS.map((e, i) => [i, eIdx(GEN[e])]);
export const KE: readonly [number, number][] = ELEMENTS.map((e, i) => [i, eIdx(CTRL[e])]);

export function WuXingDiagram({ elements }: { elements: Record<ElementTH, number> }) {
  const cx = 120;
  const cy = 120;
  const R = 82;
  const ang = [-90, -18, 54, 126, 198].map((a) => (a * Math.PI) / 180);
  const pos = ELEMENTS.map((e, i) => ({
    x: cx + R * Math.cos(ang[i]),
    y: cy + R * Math.sin(ang[i]),
    e,
    n: elements[e],
  }));

  return (
    <svg
      viewBox="0 0 240 244"
      width="100%"
      role="img"
      aria-label="วงจรห้าธาตุ เส้นทองคือวงจรเกิด เส้นแดงคือวงจรข่ม ขนาดวงกลมคือจำนวนธาตุในดวง"
      style={{ maxWidth: 230, height: "auto", display: "block", margin: "0 auto" }}
    >
      {KE.map(([a, b], k) => (
        <line
          key={`k${k}`}
          x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
          stroke="var(--ember)" strokeWidth={1} strokeDasharray="3 4" opacity={0.4}
        />
      ))}
      {SHENG.map(([a, b], k) => (
        <line
          key={`g${k}`}
          x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
          stroke="var(--gold)" strokeWidth={1.3} opacity={0.5}
        />
      ))}
      {pos.map((p, i) => {
        const r = 14 + p.n * 3.4;
        return (
          <g key={`n${i}`}>
            <circle
              cx={p.x} cy={p.y} r={r} fill={EL_DARK[p.e]} opacity={p.n ? 0.92 : 0.25}
              stroke="var(--border-gold)" strokeWidth={1}
            />
            <text
              x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="central"
              fontFamily="Noto Serif SC, serif" fontWeight={700} fontSize={p.n ? 15 : 13} fill="#1a1420"
            >
              {EL_CN[p.e]}
            </text>
            <text x={p.x} y={p.y + r + 12} textAnchor="middle" fontSize={10} fill="var(--dark-faint)">
              {p.n}
            </text>
          </g>
        );
      })}
      <text x={120} y={233} textAnchor="middle" fontSize={9.5} fill="var(--dark-faint)">
        เส้นทอง = เกิด(生) · เส้นแดง = ข่ม(克)
      </text>
    </svg>
  );
}
