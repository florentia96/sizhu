import type { Reading } from "../lib/reading";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { PetalCanvas } from "../components/PetalCanvas";
import { SummaryCard } from "../components/SummaryCard";
import { Panel } from "../components/Panel";
import { ChartGrid } from "../components/ChartGrid";
import { DayMasterCard } from "../components/DayMasterCard";
import { ElementsPanel } from "../components/ElementsPanel";
import { TenGodsPanel } from "../components/TenGodsPanel";
import { ShenShaPanel } from "../components/ShenShaPanel";
import { TipsPanel } from "../components/TipsPanel";
import { LuckPanel } from "../components/LuckPanel";

export function ResultScreen({
  reading,
  recap,
  onBack,
}: {
  reading: Reading;
  recap: string;
  onBack: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  // หน่วงเผยผลทีละแผง — ปิดเมื่อผู้ใช้ขอลดการเคลื่อนไหว
  const d = (i: number): number => (reduced ? 0 : i * 0.4);

  return (
    <div className="result-screen screen-result">
      <div className="result-bg" aria-hidden="true" />
      <div className="stars" aria-hidden="true" />
      {!reduced && <PetalCanvas />}

      <div className="result-header">
        <div className="result-brand">
          <span className="cn" aria-hidden="true">八字</span>
          <span className="recap">{recap}</span>
        </div>
        <button type="button" className="btn-back" onClick={onBack}>
          ↺ ดูดวงใหม่
        </button>
      </div>

      <div className="result-body">
        <SummaryCard reading={reading} delay={d(0)} />

        <Panel mark="柱" title="ผังสี่เสา (四柱)" delay={d(1)}>
          <ChartGrid pillars={reading.pillars} solarShift={reading.solarShift} />
          <div className="domains">
            <div className="dhead">
              <span className="mk" aria-hidden="true">宮</span> เสาทั้งสี่บอกอะไร (วัง)
            </div>
            {reading.domains.map((dm) => (
              <p className="domain" key={dm.title}>
                <b>{dm.title}</b> — {dm.desc}
              </p>
            ))}
          </div>
        </Panel>

        <Panel mark="主" title="ธาตุประจำตัว & กำลังดวง" delay={d(2)}>
          <DayMasterCard reading={reading} />
        </Panel>

        <Panel mark="五" title="สมดุลห้าธาตุ (五行)" delay={d(3)}>
          <ElementsPanel reading={reading} />
        </Panel>

        <Panel mark="神" title="สิบเทพ (十神)" delay={d(4)}>
          <TenGodsPanel reading={reading} />
        </Panel>

        <Panel mark="煞" title="神煞 (ดาวสัญลักษณ์)" delay={d(5)}>
          <ShenShaPanel reading={reading} />
        </Panel>

        <Panel mark="用" title="แนวทาง & ของมงคล" delay={d(6)}>
          <TipsPanel reading={reading} />
        </Panel>

        <Panel mark="運" title="ต้าอวิ้น (大運 · ดวงรอบ 10 ปี)" delay={d(7)}>
          <LuckPanel reading={reading} />
        </Panel>

        <div className="reveal" style={{ animationDelay: `${d(8)}s` }}>
          <footer className="result-footer">
            <div className="off">คำนวณทั้งหมดในเครื่องของคุณ · ไม่ส่งข้อมูลออก</div>
            ใช้สูตรตำแหน่งดวงอาทิตย์ (Meeus) หาจุดสารท 24 จุด — ผลตรงกับปฏิทินดาราศาสตร์ sxtwl
            (ฟอนต์โหลดจาก Google Fonts หากออฟไลน์จะใช้ฟอนต์ระบบแทน)
            <div className="disc">
              ปาจื้อเป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำราโหราศาสตร์จีน ไม่ใช่คำพยากรณ์ตายตัว โปรดใช้วิจารณญาณ — ชีวิตจริงขึ้นกับการกระทำและสภาพแวดล้อม
            </div>
            <button type="button" className="btn-restart" onClick={onBack}>
              ↺ เปิดดวงใหม่อีกครั้ง
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
