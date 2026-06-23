export interface BaziPrefill {
  date?: string;
  time?: string;
  sex?: "M" | "F";
  autocast: boolean;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{1,2}:\d{2}$/;

// Convert ?bd=YYYY-MM-DD&bt=HH:mm&sx=M|F -> prefill - mirrors the template's _prefillFromURL:
// "if bd is present => start at casting"; bt defaults to 12:00 if missing (handled at the run layer, not here)
export function parseBaziParams(query: string): BaziPrefill {
  const q = new URLSearchParams(query.replace(/^\?/, ""));
  const bd = q.get("bd");
  if (!bd || !DATE_RE.test(bd)) return { autocast: false };
  const out: BaziPrefill = { date: bd, autocast: true };
  const bt = q.get("bt");
  if (bt && TIME_RE.test(bt)) out.time = bt;
  const sx = q.get("sx");
  if (sx === "M" || sx === "F") out.sex = sx;
  return out;
}

/** Build prefill from the core profile (home) -> open BaZi without re-entering data */
export function baziPrefillFromProfile(p: {
  birthDate?: string;
  birthTime?: string;
  gender?: string;
}): BaziPrefill {
  if (!p.birthDate || !DATE_RE.test(p.birthDate)) return { autocast: false };
  return {
    date: p.birthDate,
    time: p.birthTime && TIME_RE.test(p.birthTime) ? p.birthTime : undefined,
    sex: p.gender === "หญิง" ? "F" : "M",
    autocast: true,
  };
}
