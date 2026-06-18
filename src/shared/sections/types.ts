import { z } from "zod";

export type Tone = "good" | "warn" | "bad" | "info";

export type Section =
  | { kind: "verdict"; score: number; grade: string; gradeLabel: string; summary: string; meta?: string; accent?: string; hideRing?: boolean }
  | { kind: "rows"; title: string; glyph: string; items: { n: string; title: string; meaning: string; fg: string }[] }
  | { kind: "blocks"; title: string; glyph: string; items: { title: string; tag: string; accent: string; text: string; chips: string[] }[] }
  | { kind: "grid"; title: string; glyph: string; accent?: string; cells: { name: string; value: string; note?: string }[] }
  | { kind: "cards"; title: string; glyph: string; subtitle?: string; accent?: string; items: { value: string; badge?: string; note?: string }[] }
  | { kind: "swatches"; title: string; glyph: string; tag?: string; accent?: string; text?: string; items: { name: string; hex: string }[] }
  | { kind: "prose"; title: string; glyph: string; accent?: string; paras: { h?: string; t: string }[] }
  | { kind: "compat"; score: number; label: string; a: string; b: string; accent?: string; points: { title: string; meaning: string; fg: string }[] }
  | { kind: "note"; text: string };

export const TONE_HEX: Record<Tone, string> = {
  good: "#6cc18a",
  warn: "#d8a64a",
  bad: "#e0584b",
  info: "#7da6d8",
};

const verdict = z.object({
  kind: z.literal("verdict"),
  score: z.number(),
  grade: z.string(),
  gradeLabel: z.string(),
  summary: z.string(),
  meta: z.string().optional(),
  accent: z.string().optional(),
  hideRing: z.boolean().optional(),
});

const rows = z.object({
  kind: z.literal("rows"),
  title: z.string(),
  glyph: z.string(),
  items: z.array(
    z.object({ n: z.string(), title: z.string(), meaning: z.string(), fg: z.string() }),
  ),
});

const blocks = z.object({
  kind: z.literal("blocks"),
  title: z.string(),
  glyph: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      tag: z.string(),
      accent: z.string(),
      text: z.string(),
      chips: z.array(z.string()),
    }),
  ),
});

const grid = z.object({
  kind: z.literal("grid"),
  title: z.string(),
  glyph: z.string(),
  accent: z.string().optional(),
  cells: z.array(
    z.object({ name: z.string(), value: z.string(), note: z.string().optional() }),
  ),
});

const cards = z.object({
  kind: z.literal("cards"),
  title: z.string(),
  glyph: z.string(),
  subtitle: z.string().optional(),
  accent: z.string().optional(),
  items: z.array(
    z.object({ value: z.string(), badge: z.string().optional(), note: z.string().optional() }),
  ),
});

const swatches = z.object({
  kind: z.literal("swatches"),
  title: z.string(),
  glyph: z.string(),
  tag: z.string().optional(),
  accent: z.string().optional(),
  text: z.string().optional(),
  items: z.array(z.object({ name: z.string(), hex: z.string() })),
});

const prose = z.object({
  kind: z.literal("prose"),
  title: z.string(),
  glyph: z.string(),
  accent: z.string().optional(),
  paras: z.array(z.object({ h: z.string().optional(), t: z.string() })),
});

const compat = z.object({
  kind: z.literal("compat"),
  score: z.number(),
  label: z.string(),
  a: z.string(),
  b: z.string(),
  accent: z.string().optional(),
  points: z.array(
    z.object({ title: z.string(), meaning: z.string(), fg: z.string() }),
  ),
});

const note = z.object({ kind: z.literal("note"), text: z.string() });

export const SectionSchema: z.ZodType<Section> = z.discriminatedUnion("kind", [
  verdict,
  rows,
  blocks,
  grid,
  cards,
  swatches,
  prose,
  compat,
  note,
]);

export const ReportSchema = z.array(SectionSchema).min(1);
