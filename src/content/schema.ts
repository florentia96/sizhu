// zod schema คุมรูปร่าง content/th.json — กัน key หาย/พิมพ์ผิด ตั้งแต่ตอน build
import { z } from "zod";

const nameDesc = z.object({ name: z.string(), desc: z.string() });
const elInfo = z.object({
  color: z.string(),
  dir: z.string(),
  vibe: z.string(),
  fields: z.string(),
});
const labeled = z.object({ label: z.string(), meaning: z.string() });
const titleDesc = z.object({ title: z.string(), desc: z.string() });
const stateCopy = z.object({ label: z.string(), desc: z.string() });

export const contentSchema = z.object({
  stemNature: z.record(z.string(), nameDesc),
  polarityNote: z.object({ หยาง: z.string(), ยิน: z.string() }),
  elInfo: z.record(z.string(), elInfo),
  tgMean: z.record(z.string(), z.string()),
  luckByTg: z.record(z.string(), z.string()),
  relMean: z.record(z.string(), labeled),
  pillarDomain: z.record(z.string(), titleDesc),
  careerByGroup: z.record(z.string(), z.string()),
  organ: z.record(z.string(), z.string()),
  seasonName: z.record(z.string(), z.string()),
  seasonState: z.object({
    ruling: stateCopy,
    supported: stateCopy,
    draining: stateCopy,
    controlling: stateCopy,
    controlled: stateCopy,
  }),
  strengthPara: z.object({
    weak: z.string(),
    balanced: z.string(),
    strong: z.string(),
  }),
  shenSha: z.record(z.string(), z.string()),
  combine: z.record(z.string(), z.string()),
  tiaohou: z.object({
    spring: z.string(),
    summer: z.string(),
    autumn: z.string(),
    winter: z.string(),
  }),
});

export type Content = z.infer<typeof contentSchema>;
export type SeasonStateId = keyof Content["seasonState"];
