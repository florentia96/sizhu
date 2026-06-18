import type { Section } from "../shared/sections/types";

export type Field =
  | { label: string; type: "text" | "tel" | "date" | "time" | "month"; placeholder?: string }
  | { label: string; type: "select"; options: string[] }
  | { label: string; type: "textarea"; placeholder?: string }
  | { label: string; type: "city" };

export type GroupId = "numbers" | "names" | "astro" | "chinese" | "daily";

export interface FeatureMeta {
  id: string;
  name: string;
  cn: string;
  desc: string;
  long: string;
}

export interface FeatureEngine {
  build(vals: string[]): Section[];
}

export interface FeatureDef {
  meta: FeatureMeta;
  group: GroupId;
  fields: Field[];
  engine: FeatureEngine;
  fullRoute?: boolean;
}

export type { Section };
