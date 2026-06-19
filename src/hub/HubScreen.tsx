import { useState } from "react";
import { FEATURES } from "../app/registry";
import type { FeatureDef, GroupId } from "../app/feature";
import { GROUPS, type GroupMeta } from "./groups";
import { TodayCard } from "./TodayCard";
import { CategoryNav, type GroupFilter } from "./CategoryNav";

export interface HubProps {
  query: string;
  onOpen: (id: string) => void;
  features?: Record<string, FeatureDef>;
}

interface FlatFeature {
  id: string;
  name: string;
  desc: string;
  cn: string;
  group: GroupId;
  color: string;
  glow: string;
  groupTitle: string;
}

function flatten(features: Record<string, FeatureDef>): FlatFeature[] {
  const byId: Record<GroupId, GroupMeta> = {} as Record<GroupId, GroupMeta>;
  for (const g of GROUPS) byId[g.id] = g;
  return Object.values(features).map((f) => {
    const g = byId[f.group];
    return {
      id: f.meta.id,
      name: f.meta.name,
      desc: f.meta.desc,
      cn: f.meta.cn,
      group: f.group,
      color: g.color,
      glow: g.glow,
      groupTitle: g.title,
    };
  });
}

const CARD: React.CSSProperties = {
  position: "relative",
  textAlign: "left",
  background: "var(--surface)",
  border: "1px solid rgba(216,166,74,.14)",
  borderRadius: "var(--radius-card)",
  padding: 20,
  cursor: "pointer",
  overflow: "hidden",
};

const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(238px,1fr))",
  gap: 13,
};

function FeatureCard({ f, onOpen }: { f: FlatFeature; onOpen: (id: string) => void }) {
  return (
    <button type="button" onClick={() => onOpen(f.id)} style={CARD}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 13,
        }}
      >
        <span style={{ fontFamily: "var(--font-cn)", fontSize: "2.3rem", lineHeight: 1, color: f.color }}>
          {f.cn}
        </span>
        <span style={{ color: "#4a4740", fontSize: "1.1rem" }}>→</span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 600,
          fontSize: "1.02rem",
          color: "#ece4d2",
          marginBottom: 5,
          lineHeight: 1.3,
        }}
      >
        {f.name}
      </div>
      <div style={{ fontSize: ".9rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{f.desc}</div>
    </button>
  );
}

function Hero({ flat, onOpen }: { flat: FlatFeature[]; onOpen: (id: string) => void }) {
  const popularIds = ["phone", "dream", "luckycolor", "compat", "bazi"];
  const popMeta: Record<string, { cn: string; label: string }> = {
    phone: { cn: "號", label: "เบอร์มงคล" },
    dream: { cn: "夢", label: "ฝัน→เลขเด็ด" },
    luckycolor: { cn: "彩", label: "สีมงคล" },
    compat: { cn: "緣", label: "ดวงคู่" },
    bazi: { cn: "八", label: "ปาจื้อ" },
  };
  const known = new Set(flat.map((f) => f.id));
  const popular = popularIds.filter((id) => known.has(id)).map((id) => ({ id, ...popMeta[id] }));

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: 30,
        border: "1px solid rgba(216,166,74,.2)",
        borderRadius: 6,
        background: "linear-gradient(165deg, rgba(40,30,28,.55), rgba(22,26,34,.5))",
        padding: "clamp(34px,6vw,56px) clamp(26px,5vw,48px)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "clamp(24px,6vw,60px)",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-cn)",
          fontSize: "clamp(90px,18vw,180px)",
          color: "rgba(216,166,74,.13)",
          animation: "floaty 7s ease-in-out infinite",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        運
      </div>
      <div style={{ position: "relative", maxWidth: 600 }}>
        <div
          style={{
            fontSize: ".74rem",
            letterSpacing: ".36em",
            textTransform: "uppercase",
            color: "var(--primary-bright)",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          รวมศาสตร์มงคล · 22 บริการ
        </div>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: "clamp(2.4rem,6.5vw,3.6rem)",
            lineHeight: 1.1,
            color: "var(--text-strong)",
            marginBottom: 14,
          }}
        >
          ดูดวงครบ
          <br />
          จบในที่เดียว
        </h1>
        <div
          style={{
            fontFamily: "var(--font-cn)",
            fontSize: "clamp(1.1rem,3vw,1.5rem)",
            color: "var(--gold)",
            letterSpacing: ".22em",
            marginBottom: 16,
            textShadow: "0 0 16px rgba(216,166,74,.3)",
          }}
        >
          命 · 名 · 數 · 星 · 緣
        </div>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 28, maxWidth: 480, fontWeight: 300 }}>
          เลขศาสตร์ · นามศาสตร์ · โหราศาสตร์ · ศาสตร์จีน และความเชื่อไทย รวมไว้ในที่เดียว — เลือกศาสตร์ที่อยากเปิดได้เลย
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {popular.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpen(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                minHeight: "var(--tap-min)",
                background: "rgba(255,255,255,.04)",
                color: "var(--text)",
                border: "1px solid rgba(216,166,74,.3)",
                borderRadius: 24,
                padding: "9px 16px",
                fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: "var(--font-cn)", color: "var(--gold)" }}>{p.cn}</span> {p.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HubScreen({ query, onOpen, features = FEATURES }: HubProps) {
  const flat = flatten(features);
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const results = searching
    ? flat.filter((f) => (f.name + f.desc + f.groupTitle).toLowerCase().includes(q))
    : [];

  const [activeGroup, setActiveGroup] = useState<GroupFilter>("all");
  const counts = GROUPS.reduce(
    (acc, g) => {
      acc[g.id] = flat.filter((f) => f.group === g.id).length;
      return acc;
    },
    {} as Record<GroupId, number>,
  );

  return (
    <>
      {!searching && <TodayCard onOpen={onOpen} />}
      <Hero flat={flat} onOpen={onOpen} />

      {searching ? (
        <section style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 11, marginBottom: 20 }}>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: "1.4rem",
                color: "var(--text-strong)",
                margin: 0,
              }}
            >
              ผลการค้นหา
            </h2>
            <span style={{ color: "var(--text-dim)", fontSize: ".9rem" }}>พบ {results.length} ศาสตร์</span>
          </div>
          <div
            data-testid="hub-search-results"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(252px,1fr))", gap: 13 }}
          >
            {results.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onOpen(f.id)}
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                  background: "var(--surface)",
                  border: "1px solid var(--border-gold)",
                  borderRadius: "var(--radius-card)",
                  padding: 16,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cn)",
                    fontSize: "1.9rem",
                    color: f.color,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {f.cn}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: ".97rem", color: "#ece4d2" }}>{f.name}</div>
                  <div
                    style={{
                      fontSize: ".84rem",
                      color: "var(--text-dim)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {f.groupTitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <CategoryNav active={activeGroup} onPick={setActiveGroup} counts={counts} />
          {GROUPS.map((g) => {
            if (activeGroup !== "all" && g.id !== activeGroup) return null;
            const items = flat.filter((f) => f.group === g.id);
            if (items.length === 0) return null;
            return (
              <section key={g.id} style={{ marginTop: 46 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cn)",
                      fontSize: "2.1rem",
                      lineHeight: 1,
                      color: g.color,
                      textShadow: `0 0 18px ${g.color}`,
                    }}
                  >
                    {g.cn}
                  </span>
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 600,
                        fontSize: "1.32rem",
                        color: "var(--text-strong)",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {g.title}
                    </h2>
                    <div style={{ fontSize: ".84rem", color: "var(--text-dim)" }}>{g.sub}</div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "linear-gradient(90deg,rgba(216,166,74,.3),transparent)",
                      marginLeft: 6,
                    }}
                  />
                </div>
                <div style={GRID}>
                  {items.map((f) => (
                    <FeatureCard key={f.id} f={f} onOpen={onOpen} />
                  ))}
                </div>
              </section>
            );
          })}

          <p
            style={{
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: ".82rem",
              marginTop: 60,
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            มูดี · ผลทำนายเป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำรา ใช้เพื่อความบันเทิง โปรดใช้วิจารณญาณ
          </p>
        </>
      )}
    </>
  );
}
