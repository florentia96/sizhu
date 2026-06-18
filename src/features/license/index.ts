import type { FeatureDef } from "../../app/feature";
import { licenseMeta } from "./meta";
import { licenseFields } from "./fields";
import { licenseEngine } from "./engine";

export const def: FeatureDef = {
  meta: licenseMeta,
  group: "numbers",
  fields: licenseFields,
  engine: licenseEngine,
};
