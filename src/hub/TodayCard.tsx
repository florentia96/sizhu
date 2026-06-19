import { useState, type CSSProperties } from "react";
import { dayFromDate, DAY_LORD, swatch } from "../features/_shared/thaiAstro";
import { loadProfile, patchProfile, clearProfile } from "../shared/profile/profile";

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

function fmtBirth(s: string): string {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return s;
  return `${d} ${THAI_MONTHS[m - 1]} ${y + 543}`;
}

const QUICK = [
  { id: "birthday", cn: "日", label: "ดวงวันเกิด" },
  { id: "num7", cn: "局", label: "เลข 7 ตัว" },
  { id: "luckycolor", cn: "彩", label: "สีมงคล" },
  { id: "bazi", cn: "八", label: "ปาจื้อ" },
];

const CARD: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  marginTop: 30,
  border: "1px solid rgba(216,166,74,.2)",
  borderRadius: "var(--radius-card, 6px)",
  background: "linear-gradient(165deg, rgba(40,30,28,.55), rgba(22,26,34,.5))",
  padding: "clamp(20px,4vw,28px)",
};

const EYEBROW: CSSProperties = {
  fontSize: ".74rem",
  letterSpacing: ".32em",
  textTransform: "uppercase",
  color: "var(--primary-bright, #e0584b)",
  fontWeight: 600,
  marginBottom: 6,
};

const DATELINE: CSSProperties = {
  fontFamily: "var(--font-head, 'Anuphan', system-ui, sans-serif)",
  fontWeight: 600,
  fontSize: "clamp(1.15rem,3.4vw,1.5rem)",
  color: "var(--text-strong, #f4ecd9)",
  marginBottom: 14,
};

const SWATCH_ROW: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" };
const SWATCH: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 7, fontSize: ".88rem", color: "var(--text-muted, #b9b2a0)" };
const DOT = (hex: string): CSSProperties => ({
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: hex,
  boxShadow: "0 0 0 1px rgba(255,255,255,.15)",
  flex: "0 0 auto",
});

const DIVIDER: CSSProperties = { height: 1, background: "rgba(216,166,74,.18)", margin: "18px 0 16px" };

const CHIP_WRAP: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 };
const CHIP: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  minHeight: "var(--tap-min, 44px)",
  background: "rgba(255,255,255,.04)",
  color: "var(--text, #e7dcc2)",
  border: "1px solid rgba(216,166,74,.3)",
  borderRadius: 24,
  padding: "9px 16px",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};

const DATE_INPUT: CSSProperties = {
  fontSize: "16px",
  minHeight: "var(--tap-min, 44px)",
  colorScheme: "dark",
  border: "1px solid var(--border-gold, rgba(216,166,74,.3))",
  background: "var(--surface-inset, rgba(255,255,255,.04))",
  borderRadius: "var(--radius-input, 4px)",
  padding: "10px 12px",
  color: "var(--text, #e7dcc2)",
  outline: "none",
};

const LINK: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "var(--tap-min, 44px)",
  background: "none",
  border: 0,
  padding: "0 12px",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: ".78rem",
  color: "var(--text-dim, #8a8474)",
  textDecoration: "underline dotted",
};

export function TodayCard({ onOpen }: { onOpen: (id: string) => void }) {
  const [profile, setProfile] = useState(loadProfile);

  const now = new Date();
  const weekday = dayFromDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const dateStr = `วัน${weekday}ที่ ${now.getDate()} ${THAI_MONTHS[now.getMonth()]} ${now.getFullYear() + 543}`;
  const info = DAY_LORD[weekday] ?? DAY_LORD["อาทิตย์"];
  const colors = swatch(info.color);

  const onPick = (v: string) => {
    if (v) setProfile(patchProfile({ birthDate: v }));
  };
  const onClear = () => {
    clearProfile();
    setProfile({});
  };

  return (
    <section style={CARD} aria-label="ดวงวันนี้">
      <div style={EYEBROW}>ดวงวันนี้ · Today</div>
      <div style={DATELINE}>{dateStr}</div>

      <div style={{ fontSize: ".84rem", color: "var(--text-dim, #8a8474)", marginBottom: 9 }}>
        สีมงคลของวัน{weekday}
      </div>
      <div style={SWATCH_ROW}>
        {colors.map((c) => (
          <span key={c.name} style={SWATCH}>
            <span style={DOT(c.hex)} aria-hidden />
            {c.name}
          </span>
        ))}
      </div>

      <div style={DIVIDER} />

      {profile.birthDate ? (
        <div>
          <div style={{ fontSize: ".92rem", color: "var(--text-muted, #b9b2a0)" }}>
            วันเกิดที่บันทึกไว้: <b style={{ color: "var(--text-strong, #f4ecd9)" }}>{fmtBirth(profile.birthDate)}</b> — แตะเพื่อเปิดดวงได้เลย ไม่ต้องกรอกซ้ำ
          </div>
          <div style={CHIP_WRAP}>
            {QUICK.map((q) => (
              <button key={q.id} type="button" style={CHIP} onClick={() => onOpen(q.id)}>
                <span style={{ fontFamily: "var(--font-cn, serif)", color: "var(--gold, #d8a64a)" }}>{q.cn}</span>
                {q.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 14 }}>
            <label style={{ fontSize: ".78rem", color: "var(--text-dim, #8a8474)", display: "flex", gap: 8, alignItems: "center" }}>
              เปลี่ยนวันเกิด
              <input type="date" defaultValue={profile.birthDate} onChange={(e) => onPick(e.target.value)} style={DATE_INPUT} />
            </label>
            <button type="button" style={LINK} onClick={onClear}>
              ล้างวันเกิด
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: ".95rem", color: "var(--text-muted, #b9b2a0)", marginBottom: 11 }}>
            บันทึกวันเกิดครั้งเดียว — ดูดวงได้ทุกศาสตร์โดยไม่ต้องกรอกซ้ำ (เก็บไว้ในเครื่องนี้เท่านั้น)
          </div>
          <label style={{ fontSize: ".82rem", color: "var(--text-dim, #8a8474)", display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
            วันเกิดของคุณ
            <input type="date" onChange={(e) => onPick(e.target.value)} style={DATE_INPUT} aria-label="วันเกิดของคุณ" />
          </label>
        </div>
      )}
    </section>
  );
}
