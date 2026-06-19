import type { FeatureDef, GroupId } from "./feature";

const mods = import.meta.glob("../features/*/index.ts", { eager: true }) as Record<string, { def?: FeatureDef }>;

export const FEATURES: Record<string, FeatureDef> = {};
for (const m of Object.values(mods)) {
  if (m?.def?.meta?.id) FEATURES[m.def.meta.id] = m.def;
}

export function groupsOf(): Record<GroupId, FeatureDef[]> {
  const g: Record<GroupId, FeatureDef[]> = { numbers: [], names: [], astro: [], chinese: [], daily: [] };
  for (const d of Object.values(FEATURES)) g[d.group].push(d);
  return g;
}
