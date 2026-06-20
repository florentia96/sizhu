export interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  onLogo: () => void;
}

const HEADER: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "rgba(14,17,22,.78)",
  backdropFilter: "blur(14px)",
  borderBottom: "1px solid var(--border-gold)",
};

const INNER: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "13px 22px",
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const LOGO_MARK: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 8,
  border: "1px solid rgba(216,166,74,.45)",
  background: "rgba(177,53,42,.12)",
  display: "grid",
  placeItems: "center",
  fontFamily: "var(--font-cn)",
  fontSize: 23,
  color: "var(--gold)",
  textShadow: "0 0 14px rgba(216,166,74,.5)",
};

const SEARCH_WRAP: React.CSSProperties = {
  flex: 1,
  maxWidth: 430,
  margin: "0 auto",
  position: "relative",
};

const SEARCH_INPUT: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  minHeight: "var(--tap-min)",
  border: "1px solid rgba(216,166,74,.22)",
  background: "rgba(255,255,255,.035)",
  borderRadius: "var(--radius-input)",
  padding: "11px 14px 11px 40px",
  fontSize: 16,
  color: "var(--text)",
  outline: "none",
  colorScheme: "dark",
};

function SearchIcon() {
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx={11} cy={11} r={7} />
      <line x1={16.5} y1={16.5} x2={21} y2={21} />
    </svg>
  );
}

export function Header({ query, onQueryChange, onLogo }: HeaderProps) {
  return (
    <header style={HEADER}>
      <div style={INNER}>
        <div
          onClick={onLogo}
          role="button"
          tabIndex={0}
          aria-label="กลับหน้าแรก"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onLogo();
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, minHeight: "var(--tap-min)", cursor: "pointer", flexShrink: 0 }}
        >
          <div style={LOGO_MARK}>卜</div>
          <div style={{ lineHeight: 1.05 }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 21,
                color: "var(--text-strong)",
                letterSpacing: ".02em",
              }}
            >
              มูดีย์
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-dim)", letterSpacing: 3, fontWeight: 500 }}>
              MOODEE · 神算
            </div>
          </div>
        </div>

        <div style={SEARCH_WRAP}>
          <div
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-dim)",
              display: "flex",
            }}
          >
            <SearchIcon />
          </div>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ค้นหาศาสตร์ เช่น เบอร์ ฝัน ราศี"
            aria-label="ค้นหาศาสตร์"
            style={SEARCH_INPUT}
          />
        </div>
      </div>
    </header>
  );
}
