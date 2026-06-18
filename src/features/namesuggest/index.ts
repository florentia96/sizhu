import type { FeatureDef } from "../../app/feature";
import { namesuggestMeta } from "./meta";
import { namesuggestFields } from "./fields";
import { namesuggestEngine } from "./engine";

export const def: FeatureDef = {
  meta: namesuggestMeta,
  group: "names",
  fields: namesuggestFields,
  engine: namesuggestEngine,
};
