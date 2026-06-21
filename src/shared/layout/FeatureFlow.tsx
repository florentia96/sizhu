import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Section } from "../sections/types";
import { FEATURES } from "../../app/registry";
import { hrefFor } from "../../app/routes";
import { accentOf } from "../../hub/groups";
import { useFormRefs } from "../forms/useFormRefs";
import { FieldRenderer } from "../forms/FieldRenderer";
import { CityField } from "../forms/CityField";
import { SectionRenderer } from "../sections/SectionRenderer";
import { ShareBar } from "../share/ShareBar";
import { ResultHero } from "../share/ResultHero";
import { CastingScreen } from "../../screens/CastingScreen";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { loadProfile } from "../profile/profile";
import { resolveCoreValue } from "../profile/resolveCore";

type Mode = "form" | "casting" | "result";

const CAST_MS = 1400;

export function FeatureFlow({ id, onHome }: { id: string; onHome: () => void }) {
  const def = FEATURES[id];
  const reduced = usePrefersReducedMotion();
  const { refFor, readInputs } = useFormRefs();
  const [profile] = useState(loadProfile);

  const fields = def?.fields ?? [];
  const extra = fields
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => resolveCoreValue(f, profile) === null);
  const hasForm = extra.length > 0;

  const [mode, setMode] = useState<Mode>(hasForm ? "form" : "casting");
  const [sections, setSections] = useState<Section[] | null>(null);
  // ค่าที่ผู้ใช้กรอกในฟอร์ม เก็บไว้เติมกลับเมื่อกด "แก้ไขข้อมูลที่กรอก" (ฟอร์ม unmount ตอนไป casting/result)
  const [draft, setDraft] = useState<string[]>([]);
  const castT = useRef<number | undefined>(undefined);

  const accent = def ? accentOf(def.group) : "var(--gold)";

  const run = (): void => {
    if (!def) return;
    const raw = readInputs(fields.length);
    setDraft(raw);
    const vals = fields.map((f, i) => resolveCoreValue(f, profile) ?? raw[i] ?? "");
    setSections(def.engine.build(vals));
    if (reduced) {
      setMode("result");
      window.scrollTo(0, 0);
      return;
    }
    setMode("casting");
    window.clearTimeout(castT.current);
    castT.current = window.setTimeout(() => {
      setMode("result");
      window.scrollTo(0, 0);
    }, CAST_MS);
  };

  // core-only (ไม่มี field พิเศษ): เปิดดวงทันทีที่เข้าหน้า → casting → result
  useEffect(() => {
    if (def && !hasForm) run();
    return () => window.clearTimeout(castT.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!def) {
    return (
      <div style={{ marginTop: 40, textAlign: "center", color: "var(--text-dim, #8a8474)" }}>
        <p style={{ fontSize: "1rem" }}>ไม่พบฟีเจอร์นี้</p>
        <button type="button" onClick={onHome} style={notFoundBtn}>
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  if (mode === "casting") {
    return (
      <CastingScreen
        onSkip={() => {
          window.clearTimeout(castT.current);
          setMode("result");
          window.scrollTo(0, 0);
        }}
        glyph={def.meta.cn}
        text="กำลังเปิดดวง…"
        sub={def.meta.name}
      />
    );
  }

  if (mode === "result" && sections) {
    return (
      <div style={{ marginTop: 24 }}>
        <ResultHero featureName={def.meta.name} glyph={def.meta.cn} sections={sections} accent={accent} />
        <ShareBar
          featureName={def.meta.name}
          sections={sections}
          url={
            typeof window !== "undefined"
              ? `${window.location.origin}${hrefFor({ name: "feature", id })}`
              : hrefFor({ name: "feature", id })
          }
        />
        <SectionRenderer sections={sections} accent={accent} />
        <div style={{ textAlign: "center", margin: "26px 0 0", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {hasForm && (
            <button type="button" onClick={() => setMode("form")} style={ghostBtn}>
              ↺ แก้ไขข้อมูลที่กรอก
            </button>
          )}
          <button type="button" onClick={onHome} style={ghostBtn}>
            ← กลับหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  // mode === "form" — กรอกเฉพาะข้อมูลที่ศาสตร์นี้ต้องใช้เพิ่ม (วันเกิด/เพศ ดึงจากหน้าแรกให้แล้ว)
  return (
    <div style={{ maxWidth: 440, margin: "30px auto 0" }}>
      <div style={formCard}>
        <div style={formHead}>
          <span style={{ fontFamily: "'Noto Serif SC',serif", color: accent }}>{def.meta.cn}</span>{" "}
          {def.meta.name}
        </div>
        <p style={formSubhead}>กรอกข้อมูลเพิ่มเติมสำหรับศาสตร์นี้ แล้วกดดูผลทำนาย</p>

        {extra.map(({ f, i }) =>
          f.type === "city" ? (
            <CityField key={i} index={i} refFor={refFor} defaultValue={draft[i]} label={f.label} optional={f.optional} />
          ) : (
            <FieldRenderer key={i} field={f} index={i} refFor={refFor} defaultValue={draft[i]} />
          ),
        )}

        <button type="button" onClick={run} style={submitBtn}>
          ดูผลทำนาย
        </button>
        <p style={disclaimer}>ผลทำนายเป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำรา ไม่ใช่คำพยากรณ์ตายตัว</p>
      </div>
    </div>
  );
}

const notFoundBtn: CSSProperties = {
  marginTop: 14,
  minHeight: "var(--tap-min, 44px)",
  border: "1px solid var(--border-gold, rgba(216,166,74,.3))",
  background: "var(--surface-inset, rgba(255,255,255,.04))",
  color: "var(--text, #e7dcc2)",
  borderRadius: 4,
  padding: "10px 18px",
  cursor: "pointer",
};

const formCard: CSSProperties = {
  background: "var(--surface, rgba(24,28,36,.72))",
  border: "1px solid var(--border-gold, rgba(216,166,74,.18))",
  borderRadius: "var(--radius-card, 5px)",
  padding: 24,
  boxShadow: "var(--shadow, 0 10px 34px rgba(0,0,0,.4))",
};

const formHead: CSSProperties = {
  fontFamily: "'Anuphan',system-ui,sans-serif",
  fontWeight: 600,
  fontSize: "1.05rem",
  color: "var(--text-strong, #ece4d2)",
  display: "flex",
  alignItems: "center",
  gap: 9,
  marginBottom: 6,
};

const formSubhead: CSSProperties = {
  margin: "0 0 18px",
  fontSize: ".82rem",
  color: "var(--text-muted, #b9b2a0)",
  lineHeight: 1.5,
};

const submitBtn: CSSProperties = {
  width: "100%",
  marginTop: 8,
  border: "none",
  borderRadius: 4,
  padding: 14,
  fontFamily: "'Anuphan',system-ui,sans-serif",
  fontWeight: 600,
  fontSize: "1.05rem",
  color: "#fff",
  cursor: "pointer",
  background: "var(--primary, #b1352a)",
  boxShadow: "0 2px 0 var(--primary-shadow, #8a2820)",
};

const ghostBtn: CSSProperties = {
  minHeight: "var(--tap-min, 44px)",
  border: "1px solid var(--border-gold, rgba(216,166,74,.3))",
  background: "var(--surface-inset, rgba(255,255,255,.04))",
  color: "var(--text, #e7dcc2)",
  borderRadius: 4,
  padding: "10px 18px",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: ".9rem",
};

const disclaimer: CSSProperties = {
  margin: "13px 0 0",
  fontSize: ".72rem",
  color: "var(--text-faint, #6f6a5c)",
  textAlign: "center",
  lineHeight: 1.6,
};
