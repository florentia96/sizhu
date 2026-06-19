import { useState, type CSSProperties } from "react";
import type { Section } from "../sections/types";
import { buildShareText } from "./buildShareText";

const WRAP: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 9,
  marginBottom: 14,
  padding: "12px 14px",
  background: "var(--surface, rgba(24,28,36,.72))",
  border: "1px solid var(--border-gold, rgba(216,166,74,.18))",
  borderRadius: "var(--radius-card, 6px)",
};

const LABEL: CSSProperties = {
  fontSize: ".82rem",
  color: "var(--text-dim, #8a8474)",
  marginRight: 4,
};

const BTN: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  fontFamily: "inherit",
  fontSize: ".84rem",
  color: "var(--paper, #e7dcc2)",
  background: "var(--ember-soft, rgba(224,88,75,.16))",
  border: "1px solid rgba(224,88,75,.4)",
  borderRadius: 20,
  padding: "8px 15px",
  cursor: "pointer",
};

const BTN_GHOST: CSSProperties = {
  ...BTN,
  background: "rgba(255,255,255,.04)",
  border: "1px solid var(--border-gold, rgba(216,166,74,.3))",
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
      /* clipboard ถูกบล็อก — เงียบไว้ */
    }
  };

  const onShare = async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: `${featureName} · MooDee`, text, url });
        note("shared");
      } catch {
        /* ผู้ใช้ยกเลิก หรือไม่รองรับ */
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
