import { type CSSProperties } from "react";
import { dayFromDate, DAY_LORD, swatch } from "../features/_shared/thaiAstro";
import type { Profile } from "../shared/profile/profile";

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
  marginTop: 26,
  border: "1px solid var(--border-gold)",
  borderRadius: "var(--radius-card)",
  background: "var(--surface)",
  backgroundImage: "linear-gradient(160deg, color-mix(in srgb, var(--ame) 12%, transparent), transparent 70%)",
  backdropFilter: "blur(var(--glass-blur))",
  WebkitBackdropFilter: "blur(var(--glass-blur))",
  boxShadow: "var(--shadow-sm)",
  padding: "clamp(20px,4vw,28px)",
};

const EYEBROW: CSSProperties = {
  fontSize: ".74rem",
  letterSpacing: ".3em",
  textTransform: "uppercase",
  color: "var(--ame)",
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
  width: 18,
  height: 18,
  borderRadius: "50%",
  background: hex,
  boxShadow: "0 0 0 1px var(--border-gold), var(--shadow-sm)",
  flex: "0 0 auto",
});

const DIVIDER: CSSProperties = { height: 1, background: "var(--border-gold)", margin: "18px 0 16px" };

const CHIP_WRAP: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 };
const CHIP: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  minHeight: "var(--tap-min)",
  background: "var(--surface-inset)",
  color: "var(--text)",
  border: "1.5px solid var(--border-gold)",
  borderRadius: "var(--radius-pill)",
  padding: "9px 16px",
  fontSize: 13.5,
  cursor: "pointer",
  fontFamily: "inherit",
};

export function TodayCard({ profile, onOpen }: { profile: Profile; onOpen: (id: string) => void }) {
  const now = new Date();
  const weekday = dayFromDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const dateStr = `วัน${weekday}ที่ ${now.getDate()} ${THAI_MONTHS[now.getMonth()]} ${now.getFullYear() + 543}`;
  const info = DAY_LORD[weekday] ?? DAY_LORD["อาทิตย์"];
  const colors = swatch(info.color);

  return (
    <section style={CARD} aria-label="ดวงวันนี้">
      <div style={EYEBROW}>ดวงวันนี้</div>
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
            วันเกิดที่บันทึกไว้: <b style={{ color: "var(--text-strong, #f4ecd9)" }}>{fmtBirth(profile.birthDate)}</b> — แตะเพื่อเปิดดวงได้เลย
          </div>
          <div style={CHIP_WRAP}>
            {QUICK.map((q) => (
              <button key={q.id} type="button" style={CHIP} onClick={() => onOpen(q.id)}>
                <span style={{ fontFamily: "var(--font-cn, serif)", color: "var(--gold, #d8a64a)" }}>{q.cn}</span>
                {q.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: ".95rem", color: "var(--text-muted, #b9b2a0)" }}>
          กรอกวันเกิดที่ช่องด้านบนเพียงครั้งเดียว แล้วเปิดดูได้ทุกศาสตร์โดยไม่ต้องกรอกซ้ำ (เก็บไว้ในเครื่องนี้เท่านั้น)
        </div>
      )}
    </section>
  );
}
