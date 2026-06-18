import type { FeatureDef } from "../../app/feature";
import { nameanalyzeMeta } from "./meta";
import { nameanalyzeFields } from "./fields";
import { nameanalyzeEngine } from "./engine";

export const def: FeatureDef = {
  meta: nameanalyzeMeta,
  group: "names",
  fields: nameanalyzeFields,
  engine: nameanalyzeEngine,
};
