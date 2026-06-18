import type { FeatureDef } from "../../app/feature";
import { kalakiniMeta } from "./meta";
import { kalakiniFields } from "./fields";
import { kalakiniEngine } from "./engine";

export const def: FeatureDef = {
  meta: kalakiniMeta,
  group: "names",
  fields: kalakiniFields,
  engine: kalakiniEngine,
};
