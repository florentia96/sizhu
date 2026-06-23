import { useState, type CSSProperties } from "react";
import type { Section } from "../sections/types";
import { buildShareText } from "./buildShareText";

const WRAP: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 9,
  marginBottom: 16,
  padding: "12px 16px",
  background: "var(--surface)",
  border: "1px solid var(--border-gold)",
  borderRadius: "var(--radius-card)",
  backdropFilter: "blur(var(--glass-blur))",
  WebkitBackdropFilter: "blur(var(--glass-blur))",
};

const LABEL: CSSProperties = {
  fontSize: ".82rem",
  color: "var(--text-dim)",
  marginRight: 4,
};

const BTN: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  minHeight: "var(--tap-min)",
  fontFamily: "inherit",
  fontSize: ".84rem",
  fontWeight: 500,
  color: "var(--ember)",
  background: "var(--ember-soft)",
  border: "1px solid color-mix(in srgb, var(--ember) 38%, transparent)",
  borderRadius: "var(--radius-pill)",
  padding: "8px 16px",
  cursor: "pointer",
};

const BTN_GHOST: CSSProperties = {
  ...BTN,
  color: "var(--text)",
  background: "var(--surface-inset)",
  border: "1px solid var(--border-gold)",
};

function ShareIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={18} cy={5} r={3} />
      <circle cx={6} cy={12} r={3} />
      <circle cx={18} cy={19} r={3} />
      <line x1={8.6} y1={10.5} x2={15.4} y2={6.5} />
      <line x1={8.6} y1={13.5} x2={15.4} y2={17.5} />
    </svg>
  );
}

export function ShareBar({
  featureName,
  sections,
  url,
}: {
  featureName: string;
  sections: Section[];
  url: string;
}) {
  const [flash, setFlash] = useState<"" | "link" | "text" | "shared">("");

  const text = buildShareText(featureName, sections);

  const note = (k: "link" | "text" | "shared") => {
    setFlash(k);
    window.setTimeout(() => setFlash(""), 2200);
  };

  const copy = async (s: string, k: "link" | "text") => {
    try {
      await navigator.clipboard?.writeText(s);
      note(k);
    } catch {
      /* clipboard blocked - stay silent */
    }
  };

  const onShare = async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: `${featureName} · MooDee`, text, url });
        note("shared");
      } catch {
        /* user canceled or not supported */
      }
    } else {
      copy(`${text}\n${url}`, "text");
    }
  };

  return (
    <div style={WRAP} aria-label="แชร์ผลทำนาย">
      <span style={LABEL}>ถูกใจผลนี้?</span>
      <button type="button" style={BTN} onClick={onShare}>
        <ShareIcon /> แชร์ผล
      </button>
      <button type="button" style={BTN_GHOST} onClick={() => copy(`${text}\n${url}`, "text")}>
        คัดลอกข้อความ
      </button>
      <button type="button" style={BTN_GHOST} onClick={() => copy(url, "link")}>
        คัดลอกลิงก์
      </button>
      <span aria-live="polite" style={{ ...LABEL, color: "var(--jade, #6cc18a)", marginRight: 0 }}>
        {flash === "link" ? "คัดลอกลิงก์แล้ว" : flash === "text" ? "คัดลอกข้อความแล้ว" : flash === "shared" ? "แชร์แล้ว" : ""}
      </span>
    </div>
  );
}
