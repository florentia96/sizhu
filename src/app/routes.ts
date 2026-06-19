export type Route = {
  name: "hub" | "feature" | "bazi" | "ds";
  id?: string;
  params?: Record<string, string>;
};

// base ของแอป (GitHub Pages = "/sizhu/") — path จริงทั้งหมดอยู่ใต้ base นี้
const BASE = import.meta.env.BASE_URL || "/";
const BASE_NOSLASH = BASE.replace(/\/+$/, "");

function normalize(path: string): string {
  let p = path || "/";
  const hashIdx = p.indexOf("#");
  if (hashIdx !== -1) p = p.slice(0, hashIdx);
  if (!p.startsWith("/")) p = "/" + p;
  return p;
}

function parseQuery(query: string): Record<string, string> | undefined {
  if (!query) return undefined;
  const out: Record<string, string> = {};
  for (const pair of query.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const k = eq === -1 ? pair : pair.slice(0, eq);
    const v = eq === -1 ? "" : pair.slice(eq + 1);
    out[decodeURIComponent(k)] = decodeURIComponent(v);
  }
  return Object.keys(out).length ? out : undefined;
}

/** parse a base-relative path ("/f/phone", "/bazi?bd=...") into a Route */
export function parsePath(path: string): Route {
  const norm = normalize(path);
  const qIdx = norm.indexOf("?");
  const pathname = qIdx === -1 ? norm : norm.slice(0, qIdx);
  const query = qIdx === -1 ? "" : norm.slice(qIdx + 1);

  const segs = pathname.split("/").filter(Boolean);

  if (segs.length === 0) return { name: "hub" };

  if (segs[0] === "f" && segs[1]) {
    return { name: "feature", id: segs[1] };
  }
  if (segs[0] === "bazi") {
    const params = parseQuery(query);
    return params ? { name: "bazi", params } : { name: "bazi" };
  }
  if (segs[0] === "ds") {
    return { name: "ds" };
  }
  return { name: "hub" };
}

function buildQuery(params: Record<string, string>): string {
  const parts = Object.entries(params).map(
    ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
  );
  return parts.length ? "?" + parts.join("&") : "";
}

/** base-relative path for a route ("/f/phone") */
export function buildPath(route: Route): string {
  switch (route.name) {
    case "hub":
      return "/";
    case "feature":
      return `/f/${route.id ?? ""}`;
    case "ds":
      return "/ds";
    case "bazi":
      return "/bazi" + (route.params ? buildQuery(route.params) : "");
  }
}

/** base-prefixed path for <a href>, history.pushState และลิงก์แชร์ ("/sizhu/f/phone") */
export function hrefFor(route: Route): string {
  return (BASE_NOSLASH + buildPath(route)) || "/";
}

/** ตัด base ออกจาก location.pathname(+search) → base-relative path ที่ parsePath รับได้ */
export function relFromLocation(pathname: string, search = ""): string {
  let p = pathname || "/";
  if (BASE_NOSLASH && p.startsWith(BASE_NOSLASH)) p = p.slice(BASE_NOSLASH.length);
  if (!p.startsWith("/")) p = "/" + p;
  return p + (search || "");
}
