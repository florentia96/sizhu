import type { FeatureDef } from "../../app/feature";
import { lifeMeta, lifeFields } from "./meta";
import { lifeEngine } from "./engine";

export const def: FeatureDef = { meta: lifeMeta, group: "astro", fields: lifeFields, engine: lifeEngine };
