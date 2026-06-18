import type { FeatureDef } from "../../app/feature";
import { ascMeta, ascFields } from "./meta";
import { ascEngine } from "./engine";

export const def: FeatureDef = { meta: ascMeta, group: "astro", fields: ascFields, engine: ascEngine };
