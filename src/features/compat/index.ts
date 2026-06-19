import type { FeatureDef } from "../../app/feature";
import { compatMeta, compatFields } from "./meta";
import { compatEngine } from "./engine";

export const def: FeatureDef = { meta: compatMeta, group: "astro", fields: compatFields, engine: compatEngine };
