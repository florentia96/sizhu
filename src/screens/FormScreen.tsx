import { useState } from "react";
import type { RawForm } from "../lib/validate";
import type { Sex } from "../types";

export function FormScreen({
  onSubmit,
  error,
}: {
  onSubmit: (f: RawForm) => void;
  error: string;
}) {
  const [date, setDate] = useState("2000-01-01");
  const [time, setTime] = useState("00:00");
  const [sex, setSex] = useState<Sex>("M");
  const [advOpen, setAdvOpen] = useState(false);
  const [tz, setTz] = useState("7");
  const [lon, setLon] = useState("100.5");
  const [useSolar, setUseSolar] = useState(true);

  const submit = (): void => onSubmit({ date, time, sex, tz, lon, useSolar });

  return (
    <main className="paper-screen screen-paper">
      <div className="paper-wrap">
        <header className="brand">
          <div className="brand-eyebrow">เครื่องเปิดดวงจีน · คำนวณในเครื่อง</div>
          <h1 className="brand-cn">
            八<span>字</span>
          </h1>
          <div className="brand-sub">ปาจื้อ — ดูดวงสี่เสา</div>
          <div className="brand-row">天干 · 地支 · 十神 · 五行 · 大運</div>
        </header>

        <div className="form-card">
          <div className="form-head">
            <span className="mk" aria-hidden="true">命</span> กรอกวัน-เวลาเกิด
          </div>
          <div className="grid2">
            <div className="field">
              <label htmlFor="f-date">วันเกิด (สากล)</label>
              <input
                id="f-date" type="date" value={date}
                min="1900-01-01" max="2100-12-31"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="f-time">เวลาเกิด</label>
              <input id="f-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="field field-sex">
            <span className="field-label" id="sex-label">
              เพศ <span className="hint">(ใช้กำหนดทิศต้าอวิ้น)</span>
            </span>
            <div className="seg" role="group" aria-labelledby="sex-label">
              <button type="button" aria-pressed={sex === "M"} onClick={() => setSex("M")}>
                ชาย
              </button>
              <button type="button" aria-pressed={sex === "F"} onClick={() => setSex("F")}>
                หญิง
              </button>
            </div>
          </div>

          <button
            type="button" className="adv-toggle"
            aria-expanded={advOpen} onClick={() => setAdvOpen((v) => !v)}
          >
            {advOpen ? "▾" : "▸"} ตั้งค่าขั้นสูง (เขตเวลา / ลองจิจูด / สุริยคติ)
          </button>

          {advOpen && (
            <div className="adv">
              <div className="grid2">
                <div className="field">
                  <label htmlFor="f-tz">เขตเวลา (ชม.)</label>
                  <input
                    id="f-tz" type="number" value={tz}
                    step="0.5" min="-12" max="14"
                    onChange={(e) => setTz(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-lon">ลองจิจูด (ตอ.=+)</label>
                  <input
                    id="f-lon" type="number" value={lon}
                    step="0.1" min="-180" max="180"
                    onChange={(e) => setLon(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button" className="check" role="checkbox"
                aria-checked={useSolar} onClick={() => setUseSolar((v) => !v)}
              >
                <span className="check-box" aria-hidden="true">{useSolar ? "✓" : ""}</span>
                ปรับเป็นเวลาสุริยคติจริง (เลือกยามแม่นขึ้น)
              </button>
              <div className="form-note">
                ค่าเริ่มต้นตั้งไว้สำหรับกรุงเทพฯ (เขตเวลา +7, ลองจิจูด 100.5)
              </div>
            </div>
          )}

          <button type="button" className="go" onClick={submit}>
            เปิดดวงปาจื้อ
          </button>
          <div className="form-err" role="alert">{error}</div>
        </div>

        <div className="paper-foot">คำนวณในเครื่องของคุณทั้งหมด · ไม่ส่งข้อมูลออก</div>
      </div>
    </main>
  );
}
