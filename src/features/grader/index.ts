import type { FeatureDef } from "../../app/feature";
import { graderMeta } from "./meta";
import { graderFields } from "./fields";
import { graderEngine } from "./engine";

export const def: FeatureDef = {
  meta: graderMeta,
  group: "numbers",
  fields: graderFields,
  engine: graderEngine,
};
