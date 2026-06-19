import { useState, useEffect, type CSSProperties } from "react";
import type { Section } from "../sections/types";
import { FEATURES } from "../../app/registry";
import { accentOf } from "../../hub/groups";
import { useFormRefs } from "../forms/useFormRefs";
import { FieldRenderer } from "../forms/FieldRenderer";
import { CityField } from "../forms/CityField";
import { SectionRenderer } from "../sections/SectionRenderer";
import {
  loadProfile,
  patchProfile,
  clearProfile,
  hasProfile,
  slotForField,
  type Profile,
} from "../profile/profile";

function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 720 : false,
  );
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth <= 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return narrow;
}

export function DetailLayout({
  id,
  onHome,
}: {
  id: string;
  onHome: () => void;
}) {
  const { refFor, readInputs } = useFormRefs();
  const [sections, setSections] = useState<Section[] | null>(null);
  const [profile, setProfile] = useState(loadProfile);
  const [remember, setRemember] = useState(true);
  const [formKey, setFormKey] = useState(0);
  const narrow = useIsNarrow();

  const def = FEATURES[id];

  if (!def) {
    return (
      <div style={{ marginTop: "40px", textAlign: "center", color: "var(--text-dim, #8a8474)" }}>
        <p style={{ fontSize: "1rem" }}>ไม่พบฟีเจอร์นี้</p>
        <button
          type="button"
          onClick={onHome}
          style={{
            marginTop: "14px",
            border: "1px solid var(--border-gold, rgba(216,166,74,.3))",
            background: "var(--surface-inset, rgba(255,255,255,.04))",
            color: "var(--text, #e7dcc2)",
            borderRadius: "4px",
            padding: "10px 18px",
            cursor: "pointer",
            fontSize: ".9rem",
          }}
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  const accent = accentOf(def.group);

  const eligibleSlots = def.fields.map((f) => slotForField(f));
  const hasEligible = eligibleSlots.some(Boolean);
  const autofilled = eligibleSlots.some((s) => s && profile[s]);

  const onSubmit = (): void => {
    const vals = readInputs(def.fields.length);
    if (remember && hasEligible) {
      const patch: Partial<Profile> = {};
      eligibleSlots.forEach((s, i) => {
        if (s && vals[i]?.trim()) patch[s] = vals[i];
      });
      if (Object.keys(patch).length) setProfile(patchProfile(patch));
    }
    setSections(def.engine.build(vals));
  };

  const onClearSaved = (): void => {
    clearProfile();
    setProfile({});
    setRemember(false);
    setFormKey((k) => k + 1);
  };

  const gridStyle: CSSProperties = narrow
    ? { display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "22px", marginTop: "30px" }
    : {
        display: "grid",
        gridTemplateColumns: "minmax(0,350px) minmax(0,1fr)",
        gap: "22px",
        marginTop: "30px",
        alignItems: "start",
      };

  const formCardStyle: CSSProperties = {
    background: "var(--surface, rgba(24,28,36,.72))",
    border: "1px solid var(--border-gold, rgba(216,166,74,.18))",
    borderRadius: "var(--radius-card, 5px)",
    padding: "24px",
    boxShadow: "var(--shadow, 0 10px 34px rgba(0,0,0,.4))",
    ...(narrow ? {} : { position: "sticky", top: "80px" }),
  };

  const submitStyle: CSSProperties = {
    width: "100%",
    marginTop: "8px",
    border: "none",
    borderRadius: "4px",
    padding: "14px",
    fontFamily: "'Noto Serif Thai',serif",
    fontWeight: 600,
    fontSize: "1.05rem",
    color: "#fff",
    cursor: "pointer",
    background: "var(--primary, #b1352a)",
    boxShadow: "0 2px 0 var(--primary-shadow, #8a2820)",
  };

  const autofillNote: CSSProperties = {
    margin: "0 0 14px",
    fontSize: ".78rem",
    lineHeight: 1.5,
    color: "var(--jade, #6cc18a)",
  };

  const rememberRow: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    width: "100%",
    margin: "4px 0 12px",
    background: "none",
    border: 0,
    padding: 0,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: ".82rem",
    color: "var(--text-muted, #b9b2a0)",
  };
  const rememberBox: CSSProperties = {
    flex: "0 0 auto",
    width: "18px",
    height: "18px",
    borderRadius: "var(--radius-input, 4px)",
    border: "1px solid var(--primary-bright, #e0584b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: ".7rem",
    color: "#fff",
  };
  const rememberBoxOn: CSSProperties = { background: "var(--primary, #b1352a)" };

  const clearLink: CSSProperties = {
    background: "none",
    border: 0,
    padding: 0,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: ".74rem",
    color: "var(--text-dim, #8a8474)",
    textDecoration: "underline dotted",
  };

  return (
    <div style={gridStyle}>
      <div style={formCardStyle}>
        <div
          style={{
            fontFamily: "'Noto Serif Thai',serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--text-strong, #ece4d2)",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span style={{ fontFamily: "'Noto Serif SC',serif", color: accent }}>
            命
          </span>{" "}
          กรอกข้อมูล
        </div>

        {autofilled && <p style={autofillNote}>กรอกให้อัตโนมัติจากวันเกิดที่บันทึกไว้ในเครื่องนี้</p>}

        <div key={formKey}>
          {def.fields.map((f, i) => {
            const slot = eligibleSlots[i];
            const dv = slot ? profile[slot] : undefined;
            return f.type === "city" ? (
              <CityField key={i} index={i} refFor={refFor} defaultValue={dv} />
            ) : (
              <FieldRenderer key={i} field={f} index={i} refFor={refFor} defaultValue={dv} />
            );
          })}
        </div>

        {hasEligible && (
          <button
            type="button"
            role="checkbox"
            aria-checked={remember}
            onClick={() => setRemember((v) => !v)}
            style={rememberRow}
          >
            <span style={{ ...rememberBox, ...(remember ? rememberBoxOn : {}) }}>
              {remember ? "✓" : ""}
            </span>
            จำวันเกิดไว้ในเครื่องนี้ (กรอกครั้งเดียว ใช้ได้ทุกศาสตร์)
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          style={submitStyle}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(1px)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "none";
          }}
        >
          เปิดดูผลทำนาย
        </button>
        <p
          style={{
            margin: "13px 0 0",
            fontSize: ".72rem",
            color: "var(--text-faint, #6f6a5c)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          ผลทำนายเป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำรา ไม่ใช่คำพยากรณ์ตายตัว
        </p>
        {hasProfile(profile) && (
          <p style={{ textAlign: "center", margin: "10px 0 0" }}>
            <button type="button" onClick={onClearSaved} style={clearLink}>
              ล้างข้อมูลที่บันทึกไว้
            </button>
          </p>
        )}
      </div>

      <div>
        {sections ? (
          <SectionRenderer sections={sections} accent={accent} />
        ) : (
          <div
            style={{
              border: "1px dashed var(--border-gold, rgba(216,166,74,.3))",
              borderRadius: "var(--radius-card, 5px)",
              padding: "64px 30px",
              textAlign: "center",
              color: "var(--text-dim, #8a8474)",
              background: "var(--surface-inset, rgba(255,255,255,.02))",
            }}
          >
            <div
              style={{
                fontFamily: "'Noto Serif SC',serif",
                fontSize: "4rem",
                marginBottom: "16px",
                color: accent,
                opacity: 0.5,
                lineHeight: 1,
              }}
            >
              {def.meta.cn}
            </div>
            <div
              style={{
                fontFamily: "'Noto Serif Thai',serif",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "var(--text-muted, #b9b2a0)",
              }}
            >
              กรอกข้อมูลทางซ้าย แล้วกด "เปิดดูผลทำนาย"
            </div>
            <p
              style={{
                margin: "9px auto 0",
                fontSize: ".85rem",
                maxWidth: "330px",
                lineHeight: 1.6,
              }}
            >
              ผลลัพธ์จะปรากฏตรงนี้ พร้อมเกรด ความหมาย และคำแนะนำแบบเข้าใจง่าย
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
