import type { Section } from "../shared/sections/types";

type FieldBase = {
  label: string;
  hint?: string;
  optional?: boolean;
  // Data about the other person (e.g. the partner in a compatibility chart) - do not auto-fill from the user's profile
  partner?: boolean;
};

export type Field = FieldBase &
  (
    | {
        type: "text" | "tel" | "date" | "time" | "month";
        placeholder?: string;
        inputMode?: "numeric" | "tel" | "text";
        maxLength?: number;
      }
    | { type: "select"; options: string[] }
    | { type: "textarea"; placeholder?: string; maxLength?: number }
    | { type: "city" }
  );

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
