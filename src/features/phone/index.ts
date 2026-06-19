import type { FeatureDef } from "../../app/feature";
import { meta } from "./meta";
import { fields } from "./fields";
import { engine } from "./engine";

export const def: FeatureDef = {
  meta,
  group: "numbers",
  fields,
  engine,
};
