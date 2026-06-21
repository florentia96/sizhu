import { useState, useRef, useCallback, type CSSProperties } from "react";
import "./hub.css";
import { FEATURES } from "../app/registry";
import type { FeatureDef, GroupId } from "../app/feature";
import { GROUPS, type GroupMeta } from "./groups";
import { TodayCard } from "./TodayCard";
import { CategoryNav, type GroupFilter } from "./CategoryNav";
import { HomeProfileCard } from "./HomeProfileCard";
import { hasCoreProfile, loadProfile, type Profile } from "../shared/profile/profile";
import { featureUsesCore } from "../shared/profile/resolveCore";

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
      groupTitle: g.title,
    };
  });
}

// ตั้งค่าตัวแปร CSS --c (สีประจำหมวด) ให้ลูกหลานในกล่องใช้ต่อ — กัน TS ด้วย cast
const cvar = (c: string): CSSProperties => ({ "--c": c }) as unknown as CSSProperties;

// ป้ายสั้นของแต่ละหมวดสำหรับราวห้าศาสตร์ใน masthead
const ART_SHORT: Record<GroupId, string> = {
  numbers: "เลข",
  names: "ชื่อ",
  astro: "โหรา",
  chinese: "จีน",
  daily: "รายวัน",
};

const POP_META: Record<string, { cn: string; label: string }> = {
  phone: { cn: "號", label: "เบอร์มงคล" },
  dream: { cn: "夢", label: "ฝัน→เลขเด็ด" },
  luckycolor: { cn: "彩", label: "สีมงคล" },
  compat: { cn: "緣", label: "ดวงคู่" },
  bazi: { cn: "八", label: "ปาจื้อ" },
};
const POP_IDS = ["phone", "dream", "luckycolor", "compat", "bazi"];

function Masthead({ flat, onOpen }: { flat: FlatFeature[]; onOpen: (id: string) => void }) {
  const known = new Set(flat.map((f) => f.id));
  const popular = POP_IDS.filter((id) => known.has(id)).map((id) => ({ id, ...POP_META[id] }));

  return (
    <section className="hub-mast" aria-label="ภาพรวมมูดีย์">
      <div className="hub-mast-water" aria-hidden="true">通</div>
      <div className="hub-mast-inner">
        <div className="hub-mast-top">
          <div className="hub-seal" aria-hidden="true">卜</div>
          <div>
            <div className="hub-mast-eyebrow">通書 · รวมศาสตร์มงคล {flat.length} บริการ</div>
            <h1 className="hub-mast-title">ดูดวงครบ จบในที่เดียว</h1>
          </div>
        </div>
        <p className="hub-mast-sub">
          รวมเลขศาสตร์ นามศาสตร์ โหราศาสตร์ ศาสตร์จีน และความเชื่อไทยไว้ในที่เดียว —
          เลือกศาสตร์ที่สนใจได้เลย
        </p>
        <div className="hub-arts" aria-hidden="true">
          {GROUPS.map((g) => (
            <div className="hub-art" key={g.id} style={cvar(g.color)}>
              <span className="hub-art-cn">{g.cn}</span>
              <span className="hub-art-th">{ART_SHORT[g.id]}</span>
            </div>
          ))}
        </div>
        <div className="hub-pills">
          {popular.map((p) => (
            <button key={p.id} type="button" className="hub-pill" onClick={() => onOpen(p.id)}>
              <span className="hub-pill-cn" aria-hidden="true">{p.cn}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ f, onOpen }: { f: FlatFeature; onOpen: (id: string) => void }) {
  return (
    <button type="button" className="hub-card" style={cvar(f.color)} onClick={() => onOpen(f.id)}>
      <span className="hub-card-top">
        <span className="hub-glyph hub-card-seal" aria-hidden="true">{f.cn}</span>
      </span>
      <span className="hub-card-name">{f.name}</span>
      <span className="hub-card-desc">{f.desc}</span>
      <span className="hub-card-cta">
        <span className="hub-card-cta-text">เปิดดวง</span>
        <span className="hub-card-arrow" aria-hidden="true">→</span>
      </span>
    </button>
  );
}

function SearchResults({
  results,
  onOpen,
}: {
  results: FlatFeature[];
  onOpen: (id: string) => void;
}) {
  return (
    <section className="hub-search">
      <div className="hub-search-head">
        <h2 className="hub-search-title">ผลการค้นหา</h2>
        <span className="hub-search-count">พบ {results.length} ศาสตร์</span>
      </div>
      <div className="hub-sr-grid" data-testid="hub-search-results">
        {results.map((f) => (
          <button
            key={f.id}
            type="button"
            className="hub-sr"
            style={cvar(f.color)}
            onClick={() => onOpen(f.id)}
          >
            <span className="hub-glyph hub-sr-seal" aria-hidden="true">{f.cn}</span>
            <span style={{ minWidth: 0 }}>
              <span className="hub-sr-name" style={{ display: "block" }}>{f.name}</span>
              <span className="hub-sr-grp" style={{ display: "block" }}>{f.groupTitle}</span>
            </span>
          </button>
        ))}
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

  // โปรไฟล์แกนแหล่งเดียว — ส่งลงทั้งการ์ดกรอกและการ์ดดวงวันนี้ให้ sync กันในเซสชันเดียว
  const [profile, setProfile] = useState<Profile>(loadProfile);

  // กดศาสตร์ก่อนกรอกวันเกิด → เด้งไปฟอร์มกรอก แล้วเปิดศาสตร์นั้นให้อัตโนมัติเมื่อบันทึก
  const pendingId = useRef<string | null>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const handleOpen = useCallback(
    (id: string) => {
      const def = features[id];
      const needsCore = def ? def.fullRoute || featureUsesCore(def.fields) : false;
      if (needsCore && !hasCoreProfile(profile)) {
        pendingId.current = id;
        profileCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      onOpen(id);
    },
    [features, onOpen, profile],
  );
  const onCoreSaved = useCallback(
    (p: Profile) => {
      setProfile(p);
      const id = pendingId.current;
      pendingId.current = null;
      if (id) onOpen(id);
    },
    [onOpen],
  );
  const onCoreCleared = useCallback(() => {
    setProfile({});
    pendingId.current = null;
  }, []);

  const profileCard = (
    <div ref={profileCardRef}>
      <HomeProfileCard onSaved={onCoreSaved} onCleared={onCoreCleared} />
    </div>
  );

  if (searching) {
    return (
      <div className="hub">
        {profileCard}
        <SearchResults results={results} onOpen={handleOpen} />
      </div>
    );
  }

  return (
    <div className="hub">
      <Masthead flat={flat} onOpen={handleOpen} />
      {profileCard}
      <TodayCard profile={profile} onOpen={handleOpen} />
      <CategoryNav active={activeGroup} onPick={setActiveGroup} counts={counts} />

      {GROUPS.map((g) => {
        if (activeGroup !== "all" && g.id !== activeGroup) return null;
        const items = flat.filter((f) => f.group === g.id);
        if (items.length === 0) return null;
        return (
          <section className="hub-ch" key={g.id} style={cvar(g.color)}>
            <div className="hub-ch-head">
              <span className="hub-glyph hub-ch-seal" aria-hidden="true">{g.cn}</span>
              <div>
                <h2 className="hub-ch-title">{g.title}</h2>
                <div className="hub-ch-sub">{g.sub}</div>
              </div>
              <span className="hub-ch-rule" aria-hidden="true" />
              <span className="hub-ch-count">{items.length} ศาสตร์</span>
            </div>
            <div className="hub-grid">
              {items.map((f) => (
                <FeatureCard key={f.id} f={f} onOpen={handleOpen} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="hub-foot">
        มูดีย์ · ผลทำนายเป็นกรอบอ้างอิงเชิงสัญลักษณ์ตามตำรา ใช้เพื่อความบันเทิง โปรดใช้วิจารณญาณ
      </p>
    </div>
  );
}
