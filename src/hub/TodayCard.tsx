import { type CSSProperties } from "react";
import {
  dayFromDate,
  rasiFromDate,
  lifePathFromDate,
  personalYear,
  reduceSingle,
  swatch,
  DAY_LORD,
  LIFEPATH,
  PY_THEME,
  type DayLordEntry,
} from "../features/_shared/thaiAstro";
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

function parseYMD(s: string): { y: number; m: number; d: number } | null {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
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
  marginBottom: 12,
};

const SECTION_LABEL: CSSProperties = {
  fontSize: ".78rem",
  fontWeight: 600,
  color: "var(--text-dim)",
  letterSpacing: ".02em",
  margin: "16px 0 7px",
};

const LEAD: CSSProperties = {
  fontFamily: "var(--font-head, 'Anuphan', system-ui, sans-serif)",
  fontWeight: 600,
  fontSize: "1rem",
  color: "var(--text-strong)",
  marginBottom: 4,
};

const BODY: CSSProperties = {
  fontSize: ".86rem",
  lineHeight: 1.6,
  color: "var(--text-muted)",
  margin: 0,
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

const MINI_DOT = (hex: string): CSSProperties => ({
  width: 13,
  height: 13,
  borderRadius: "50%",
  background: hex,
  boxShadow: "0 0 0 1px var(--border-gold)",
  flex: "0 0 auto",
  display: "inline-block",
});
const ASPECT_ROW: CSSProperties = { display: "flex", alignItems: "center", gap: 10, marginTop: 7, flexWrap: "wrap" };
const ASPECT_KEY: CSSProperties = { minWidth: 30, fontSize: ".82rem", color: "var(--text-dim)" };
const ASPECT_ITEM: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".82rem", color: "var(--text-muted)" };

const DIVIDER: CSSProperties = { height: 1, background: "var(--border-gold)", margin: "18px 0 16px" };

const PERSONAL_CARD: CSSProperties = {
  background: "var(--surface-inset)",
  border: "1px solid var(--border-gold)",
  borderRadius: "var(--radius-card, 16px)",
  padding: "14px 16px",
  marginBottom: 14,
};
const STAT_WRAP: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "6px 16px", margin: "0 0 8px" };
const STAT: CSSProperties = { fontSize: ".84rem", color: "var(--text-muted)" };
const STAT_B: CSSProperties = { color: "var(--text-strong)" };

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

function AspectColors({ info }: { info: DayLordEntry }) {
  const rows: { k: string; names: string[] }[] = [
    { k: "งาน", names: info.work },
    { k: "เงิน", names: info.money },
    { k: "รัก", names: info.love },
    { k: "โชค", names: info.luck },
  ];
  return (
    <div>
      {rows.map((r) => (
        <div key={r.k} style={ASPECT_ROW}>
          <span style={ASPECT_KEY}>{r.k}</span>
          {swatch(r.names).map((c) => (
            <span key={c.name} style={ASPECT_ITEM}>
              <span style={MINI_DOT(c.hex)} aria-hidden />
              {c.name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TodayCard({ profile, onOpen }: { profile: Profile; onOpen: (id: string) => void }) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const weekday = dayFromDate(y, m, d);
  const dateStr = `วัน${weekday}ที่ ${d} ${THAI_MONTHS[m - 1]} ${y + 543}`;
  const info = DAY_LORD[weekday] ?? DAY_LORD["อาทิตย์"];
  const colors = swatch(info.color);
  const rasi = rasiFromDate(m, d);
  const yearTheme = PY_THEME[reduceSingle(y)];

  const bd = profile.birthDate ? parseYMD(profile.birthDate) : null;
  const myWeekday = bd ? dayFromDate(bd.y, bd.m, bd.d) : "";
  const myLord = bd ? DAY_LORD[myWeekday] ?? DAY_LORD["อาทิตย์"] : null;
  const myLp = bd ? lifePathFromDate(bd.y, bd.m, bd.d) : 0;
  const myPy = bd ? personalYear(bd.y, bd.m, bd.d, y) : 0;

  return (
    <section style={CARD} aria-label="ดวงวันนี้">
      <div style={EYEBROW}>ดวงวันนี้</div>
      <div style={DATELINE}>{dateStr}</div>

      <div style={LEAD}>
        ผู้ครองวัน{weekday} · {info.lord}
      </div>
      <p style={BODY}>{info.tr}</p>

      <div style={SECTION_LABEL}>สีมงคลของวัน{weekday}</div>
      <div style={SWATCH_ROW}>
        {colors.map((c) => (
          <span key={c.name} style={SWATCH}>
            <span style={DOT(c.hex)} aria-hidden />
            {c.name}
          </span>
        ))}
      </div>

      <div style={SECTION_LABEL}>สีเสริมตามด้าน</div>
      <AspectColors info={info} />

      <div style={SECTION_LABEL}>ราศีของวันนี้</div>
      <div style={LEAD}>
        ราศี{rasi.s} · ธาตุ{rasi.el}
      </div>
      <p style={BODY}>{rasi.tr}</p>

      <div style={SECTION_LABEL}>ธีมพลังปี {y + 543}</div>
      <p style={BODY}>{yearTheme}</p>

      <div style={DIVIDER} />

      {profile.birthDate && bd && myLord ? (
        <div>
          <div style={SECTION_LABEL}>วันนี้สำหรับคุณ</div>
          <div style={PERSONAL_CARD}>
            <div style={STAT_WRAP}>
              <span style={STAT}>
                ผู้ครองวันเกิด: <b style={STAT_B}>{myLord.lord}</b> (วัน{myWeekday})
              </span>
              <span style={STAT}>
                เลขชีวิต: <b style={STAT_B}>{myLp}</b> {LIFEPATH[myLp]?.k ?? ""}
              </span>
              <span style={STAT}>
                ปีส่วนตัว: <b style={STAT_B}>เลข {myPy}</b>
              </span>
            </div>
            <p style={BODY}>{PY_THEME[myPy]}</p>
          </div>
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
