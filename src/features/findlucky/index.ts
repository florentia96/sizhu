import type { FeatureDef } from "../../app/feature";
import { findluckyMeta } from "./meta";
import { findluckyFields } from "./fields";
import { findluckyEngine } from "./engine";

export const def: FeatureDef = {
  meta: findluckyMeta,
  group: "numbers",
  fields: findluckyFields,
  engine: findluckyEngine,
};
