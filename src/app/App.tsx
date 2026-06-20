import { useState, useEffect } from "react";
import { usePathRoute } from "./usePathRoute";
import { Header } from "./Header";
import { Starfield } from "./Starfield";
import { DesignSystem } from "./DesignSystem";
import { HubScreen } from "../hub/HubScreen";
import { FeatureFlow } from "../shared/layout/FeatureFlow";
import { BaziApp } from "../screens/BaziApp";
import { parseBaziParams, baziPrefillFromProfile } from "../screens/baziParams";
import { loadProfile } from "../shared/profile/profile";
import { FEATURES } from "./registry";

const MAIN: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  maxWidth: 1080,
  margin: "0 auto",
  padding: "0 22px 90px",
};

const BRAND_TITLE = "MooDee · มูดีย์ — ดูดวงครบ จบในที่เดียว 22 บริการ";
const BRAND_DESC =
  "รวมศาสตร์มงคล 22 บริการ — เบอร์มงคล ทำนายฝัน ดวงคู่ สีมงคล ราศี ปาจื้อ · คำนวณในเครื่อง 100% ไม่ส่งข้อมูลออก";

function activeFeatureId(route: ReturnType<typeof usePathRoute>["route"]): string | undefined {
  if (route.name === "feature") return route.id;
  if (route.name === "bazi") return "bazi";
  return undefined;
}

export function App() {
  const { route, navigate } = usePathRoute();
  const [query, setQuery] = useState("");

  // title/description ต่อ route — ช่วย browser tab และบริบทตอนคัดลอกลิงก์ไปแชร์
  useEffect(() => {
    const id = activeFeatureId(route);
    const meta = id ? FEATURES[id]?.meta : undefined;
    document.title = meta ? `${meta.name} · MooDee` : BRAND_TITLE;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta ? meta.desc : BRAND_DESC);
  }, [route]);

  const goHome = () => {
    setQuery("");
    navigate({ name: "hub" });
  };

  const onOpen = (id: string) => {
    if (FEATURES[id]?.fullRoute) navigate({ name: "bazi" });
    else navigate({ name: "feature", id });
  };

  const onQueryChange = (q: string) => {
    setQuery(q);
    if (q.trim() && route.name !== "hub") navigate({ name: "hub" });
  };

  // ปาจื้อใช้เลย์เอาต์เต็ม แต่ยังคงแถบบน (ชื่อเว็บ + กดกลับหน้าแรก) เหมือนทุกหน้า
  // เปิดจากหน้าแรก (มีโปรไฟล์แกน) → autocast ข้ามฟอร์ม; ลิงก์ ?bd= ใช้ค่าจาก URL; ไม่มีทั้งคู่ → ฟอร์มปาจื้อเดิม
  if (route.name === "bazi") {
    const q = route.params ? new URLSearchParams(route.params).toString() : "";
    const urlPrefill = parseBaziParams(q);
    const prefill = urlPrefill.autocast ? urlPrefill : baziPrefillFromProfile(loadProfile());
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Starfield />
        <Header query={query} onQueryChange={onQueryChange} onLogo={goHome} />
        <BaziApp prefill={prefill} onHome={goHome} />
      </div>
    );
  }

  let body: React.ReactNode;
  switch (route.name) {
    case "feature":
      body = <FeatureFlow id={route.id ?? ""} onHome={goHome} />;
      break;
    case "ds":
      body = <DesignSystem onHome={goHome} />;
      break;
    case "hub":
    default:
      body = <HubScreen query={query} onOpen={onOpen} />;
      break;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Starfield />
      <Header query={query} onQueryChange={onQueryChange} onLogo={goHome} />
      <main style={MAIN}>{body}</main>
    </div>
  );
}

export default App;
