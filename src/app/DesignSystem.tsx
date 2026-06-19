const PALETTE: { name: string; hex: string }[] = [
  { name: "พื้นราตรี", hex: "#0e1116" },
  { name: "การ์ด", hex: "#181c24" },
  { name: "ชาด (Primary)", hex: "#b1352a" },
  { name: "ชาดสว่าง", hex: "#e0584b" },
  { name: "ทองมงคล", hex: "#d8a64a" },
  { name: "หยก · เลขศาสตร์", hex: "#6cc18a" },
  { name: "แสงดาว · โหรา", hex: "#7da6d8" },
  { name: "อมีทิสต์ · ไทย", hex: "#c98ad8" },
  { name: "ครีม (ตัวอักษร)", hex: "#e7dcc2" },
];

const PANEL: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border-gold)",
  borderRadius: "var(--radius-card)",
  padding: 26,
};

const PANEL_TITLE: React.CSSProperties = {
  fontFamily: "var(--font-head)",
  fontWeight: 600,
  fontSize: "1.1rem",
  color: "#ece4d2",
  marginBottom: 18,
  display: "flex",
  alignItems: "center",
  gap: 9,
};

export function DesignSystem({ onHome }: { onHome: () => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onHome}
        style={{
          marginTop: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: "var(--tap-min, 44px)",
          background: "none",
          border: "none",
          color: "var(--text-dim)",
          fontSize: ".9rem",
          cursor: "pointer",
          padding: 0,
          fontFamily: "inherit",
        }}
      >
        ← <span>กลับหน้าแรก</span>
      </button>
      <h1
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: "2rem",
          color: "var(--text-strong)",
          margin: "14px 0 4px",
        }}
      >
        Design System · มูดี
      </h1>
      <p style={{ margin: "0 0 30px", color: "var(--text-muted)", fontSize: ".97rem" }}>
        โทนราตรีมงคล — ดำคราม + ทอง + ชาด อักษรจีน-ไทยผสาน ใช้ทั้งเว็บให้เป็นภาษาเดียวกัน
      </p>

      <div style={{ ...PANEL, marginBottom: 16 }}>
        <div style={PANEL_TITLE}>
          <span style={{ fontFamily: "var(--font-cn)", color: "var(--primary-bright)" }}>色</span> จานสี & สีประจำหมวด
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(132px,1fr))", gap: 12 }}>
          {PALETTE.map((c) => (
            <div
              key={c.hex + c.name}
              style={{
                border: "1px solid rgba(216,166,74,.12)",
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                background: "var(--surface-inset)",
              }}
            >
              <div style={{ height: 62, background: c.hex }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontWeight: 500, fontSize: ".84rem", color: "#ece4d2" }}>{c.name}</div>
                <div style={{ fontSize: ".7rem", color: "var(--text-dim)", fontFamily: "monospace" }}>{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={PANEL}>
          <div style={PANEL_TITLE}>
            <span style={{ fontFamily: "var(--font-cn)", color: "var(--primary-bright)" }}>字</span> ตัวอักษร
          </div>
          <div
            style={{
              fontFamily: "var(--font-cn)",
              fontWeight: 700,
              fontSize: "2.6rem",
              lineHeight: 1,
              color: "var(--gold)",
              textShadow: "0 0 16px rgba(216,166,74,.3)",
            }}
          >
            八字 神算
          </div>
          <div style={{ fontSize: ".74rem", color: "var(--text-dim)", margin: "6px 0 18px" }}>
            Noto Serif SC — อักษรจีน / ตัวเลขเด่น
          </div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: "1.7rem", color: "var(--text-strong)" }}>
            หัวเรื่องอักษรไทย
          </div>
          <div style={{ fontSize: ".74rem", color: "var(--text-dim)", margin: "4px 0 18px" }}>
Anuphan (ไม่มีหัว) — หัวเรื่อง น้ำหนัก 600–700
          </div>
          <div style={{ fontSize: "1rem", color: "var(--text)" }}>เนื้อความอ่านสบายตา</div>
          <p style={{ fontSize: ".88rem", color: "var(--text-muted)", margin: "5px 0 0" }}>
Anuphan (ไม่มีหัว) — ย่อหน้าและคำอธิบายทั่วไป น้ำหนัก 300–500
          </p>
        </div>

        <div style={PANEL}>
          <div style={PANEL_TITLE}>
            <span style={{ fontFamily: "var(--font-cn)", color: "var(--primary-bright)" }}>件</span> คอมโพเนนต์
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            <button
              type="button"
              style={{
                border: "none",
                minHeight: "var(--tap-min, 44px)",
                background: "var(--primary)",
                color: "#fff",
                borderRadius: "var(--radius-input)",
                padding: "11px 18px",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: ".9rem",
                cursor: "pointer",
                boxShadow: "0 2px 0 var(--primary-shadow)",
              }}
            >
              ปุ่มหลัก
            </button>
            <button
              type="button"
              style={{
                border: "1px solid rgba(216,166,74,.3)",
                minHeight: "var(--tap-min, 44px)",
                background: "none",
                color: "#cfc7b2",
                borderRadius: "var(--radius-input)",
                padding: "11px 18px",
                fontSize: ".9rem",
                cursor: "pointer",
              }}
            >
              ปุ่มรอง
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {[
              { label: "เกรด A", c: "var(--jade)" },
              { label: "มงคล", c: "var(--gold)" },
              { label: "ควรเลี่ยง", c: "var(--primary-bright)" },
            ].map((b) => (
              <span
                key={b.label}
                style={{
                  fontSize: ".78rem",
                  fontWeight: 600,
                  padding: "5px 13px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${b.c}`,
                  color: b.c,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
          <input
            placeholder="ช่องกรอกข้อมูล"
            aria-label="ช่องกรอกข้อมูล"
            style={{
              width: "100%",
              minWidth: 0,
              minHeight: "var(--tap-min, 44px)",
              border: "1px solid rgba(216,166,74,.22)",
              background: "var(--surface-inset)",
              borderRadius: "var(--radius-input)",
              padding: "11px 12px",
              fontSize: 16,
              color: "var(--text)",
              outline: "none",
              colorScheme: "dark",
            }}
          />
        </div>
      </div>
    </div>
  );
}
