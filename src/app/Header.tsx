import { useEffect, useState } from "react";

export interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  onLogo: () => void;
}

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

const HEADER: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "color-mix(in srgb, var(--bg) 80%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderBottom: "1px solid var(--border-gold)",
};

const INNER: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "12px 22px",
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const LOGO_MARK: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  background: "var(--grad-brand)",
  display: "grid",
  placeItems: "center",
  fontFamily: "var(--font-cn)",
  fontSize: 22,
  color: "var(--on-primary)",
  boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.28), 0 8px 18px -6px var(--primary)",
  flexShrink: 0,
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
  border: "1.5px solid var(--border-gold)",
  background: "var(--surface-inset)",
  borderRadius: "var(--radius-pill)",
  padding: "11px 16px 11px 42px",
  fontSize: 16,
  color: "var(--text)",
  outline: "none",
};

const TOGGLE: React.CSSProperties = {
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minWidth: "var(--tap-min)",
  minHeight: "var(--tap-min)",
  padding: "0 14px",
  border: "1.5px solid var(--border-gold)",
  borderRadius: "var(--radius-pill)",
  background: "var(--surface)",
  color: "var(--text)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "inherit",
};

function SearchIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden>
      <circle cx={11} cy={11} r={7} />
      <line x1={16.5} y1={16.5} x2={21} y2={21} />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={12} cy={12} r={4.2} />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function Header({ query, onQueryChange, onLogo }: HeaderProps) {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  // sync ค่าเริ่มต้นกับที่ anti-flash script ตั้งไว้ (เผื่อ hydrate ไม่ตรง)
  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("moodee-theme", next);
    } catch {
      /* โหมดไม่ให้เก็บ storage ก็ข้ามไป */
    }
  };

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
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 500, fontSize: 21, lineHeight: 1.2, color: "var(--text-strong)", letterSpacing: ".01em" }}>
              มูดีย์
            </div>
            <div style={{ fontSize: 9.5, color: "var(--text-dim)", letterSpacing: 3, fontWeight: 500, marginTop: 2 }}>MOODEE · 神算</div>
          </div>
        </div>

        <div style={SEARCH_WRAP}>
          <div style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", display: "flex" }}>
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

        <button
          type="button"
          onClick={toggleTheme}
          style={TOGGLE}
          aria-label={theme === "dark" ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด"}
          title={theme === "dark" ? "โหมดสว่าง" : "โหมดมืด"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
