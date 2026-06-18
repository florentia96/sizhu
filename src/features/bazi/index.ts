import type { FeatureDef } from "../../app/feature";
import { baziMeta } from "./meta";
import { baziEngine } from "./engine";

export const def: FeatureDef = {
  meta: baziMeta,
  group: "chinese",
  fields: [],
  engine: baziEngine,
  fullRoute: true,
};

export const baziFeature = def;
