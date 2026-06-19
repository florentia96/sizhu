import { useState } from "react";
import { useHashRoute } from "./useHashRoute";
import { Header } from "./Header";
import { Starfield } from "./Starfield";
import { DesignSystem } from "./DesignSystem";
import { HubScreen } from "../hub/HubScreen";
import { DetailLayout } from "../shared/layout/DetailLayout";
import { BaziApp } from "../screens/BaziApp";
import { parseBaziParams } from "../screens/baziParams";
import { FEATURES } from "./registry";

const MAIN: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  maxWidth: 1080,
  margin: "0 auto",
  padding: "0 22px 90px",
};

export function App() {
  const { route, navigate } = useHashRoute();
  const [query, setQuery] = useState("");

  const goHome = () => {
    setQuery("");
    navigate({ name: "hub" });
  };
  const goDesign = () => navigate({ name: "ds" });

  const onOpen = (id: string) => {
    if (FEATURES[id]?.fullRoute) navigate({ name: "bazi" });
    else navigate({ name: "feature", id });
  };

  const onQueryChange = (q: string) => {
    setQuery(q);
    if (q.trim() && route.name !== "hub") navigate({ name: "hub" });
  };

  // ปาจื้อใช้หน้าเต็ม (#/bazi) — ไม่มี Header/chrome ตาม spec §5.1
  if (route.name === "bazi") {
    const q = route.params ? new URLSearchParams(route.params).toString() : "";
    return <BaziApp prefill={parseBaziParams(q)} />;
  }

  let body: React.ReactNode;
  switch (route.name) {
    case "feature":
      body = <DetailLayout id={route.id ?? ""} onHome={goHome} />;
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
      <Header query={query} onQueryChange={onQueryChange} onLogo={goHome} onDesign={goDesign} />
      <main style={MAIN}>{body}</main>
    </div>
  );
}

export default App;
