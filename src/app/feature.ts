import type { Section } from "../shared/sections/types";

export type Field =
  | {
      label: string;
      type: "text" | "tel" | "date" | "time" | "month";
      placeholder?: string;
      hint?: string;
      inputMode?: "numeric" | "tel" | "text";
      maxLength?: number;
    }
  | { label: string; type: "select"; options: string[]; hint?: string }
  | { label: string; type: "textarea"; placeholder?: string; hint?: string }
  | { label: string; type: "city"; hint?: string };

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
