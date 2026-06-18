import type { FeatureDef } from "../../app/feature";
import { natalMeta, natalFields } from "./meta";
import { natalEngine } from "./engine";

export const def: FeatureDef = { meta: natalMeta, group: "astro", fields: natalFields, engine: natalEngine };
