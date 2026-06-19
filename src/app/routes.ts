export type Route = {
  name: "hub" | "feature" | "bazi" | "ds";
  id?: string;
  params?: Record<string, string>;
};

function stripHash(hash: string): string {
  let h = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!h.startsWith("/")) h = "/" + h;
  return h;
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

export function parseHash(hash: string): Route {
  const path = stripHash(hash);
  const qIdx = path.indexOf("?");
  const pathname = qIdx === -1 ? path : path.slice(0, qIdx);
  const query = qIdx === -1 ? "" : path.slice(qIdx + 1);

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

export function buildHash(route: Route): string {
  switch (route.name) {
    case "hub":
      return "#/";
    case "feature":
      return `#/f/${route.id ?? ""}`;
    case "ds":
      return "#/ds";
    case "bazi":
      return "#/bazi" + (route.params ? buildQuery(route.params) : "");
  }
}
