import type { Section } from "../sections/types";

/** Extract the key points from a reading -> 1-2 lines for sharing */
export function summarize(sections: Section[]): string[] {
  const lines: string[] = [];

  // Main line: verdict or compat (the most "wow" point)
  for (const s of sections) {
    if (s.kind === "verdict") {
      lines.push(`${s.gradeLabel} (${s.grade}) — ${s.summary}`);
      break;
    }
    if (s.kind === "compat") {
      lines.push(`${s.label}: ${s.a} × ${s.b} (${s.score}/100)`);
      break;
    }
  }

  // Secondary line: the first prose / grid / swatches found
  for (const s of sections) {
    if (lines.length >= 2) break;
    if (s.kind === "prose" && s.paras[0]) {
      const p = s.paras[0];
      lines.push(p.h ? `${p.h}: ${p.t}` : p.t);
    } else if (s.kind === "grid" && s.cells.length) {
      lines.push(s.cells.slice(0, 3).map((c) => `${c.name} ${c.value}`).join(" · "));
    } else if (s.kind === "swatches" && s.items.length) {
      lines.push(`${s.title}: ${s.items.map((i) => i.name).join(" ")}`);
    }
  }

  // Fallback when there is nothing at all - use the note
  if (!lines.length) {
    const note = sections.find((s) => s.kind === "note");
    if (note && note.kind === "note") lines.push(note.text);
  }

  return lines.map((l) => l.trim()).filter(Boolean).map((l) => clamp(l));
}

function clamp(s: string, max = 160): string {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

/** Full share text (title + key points) - excludes the url (sent separately via navigator.share) */
export function buildShareText(featureName: string, sections: Section[]): string {
  const lines = summarize(sections);
  return [`${featureName} · MooDee`, ...lines].join("\n");
}
