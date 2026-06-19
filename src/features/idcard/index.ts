import type { FeatureDef } from "../../app/feature";
import { idcardMeta } from "./meta";
import { idcardFields } from "./fields";
import { idcardEngine } from "./engine";

export const def: FeatureDef = {
  meta: idcardMeta,
  group: "numbers",
  fields: idcardFields,
  engine: idcardEngine,
};
