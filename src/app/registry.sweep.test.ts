import { describe, it, expect } from "vitest";
import { FEATURES, groupsOf } from "./registry";
import { ReportSchema } from "../shared/sections/types";

// CityField.parseCityValue accepts "name|lat|lon|tz" — the exact string the form emits onBlur.
const BANGKOK = "กรุงเทพมหานคร|13.7563|100.5018|7";

// Positional VALID sample inputs per feature — index order matches each def.fields.
// Every sample is chosen to exercise the engine's full (non-fallback) path.
const SAMPLES: Record<string, string[]> = {
  // numbers
  phone: ["0812345678"],
  license: ["1กก234", "กรุงเทพมหานคร"],
  idcard: ["บัตรประชาชน", "1234567890121"],
  findlucky: ["เบอร์โทรศัพท์", "", "มาตรฐาน"],
  grader: ["0812345678"],
  // names
  nameanalyze: ["ธนกฤต", "ใจดี", "จันทร์"],
  namesuggest: ["1990-05-15", "หญิง", ""],
  kalakini: ["จันทร์"],
  // astro
  natal: ["1990-05-15", "08:30", BANGKOK],
  ascendant: ["1990-05-15", "08:30", BANGKOK],
  num7: ["1990-05-15"],
  lifegraph: ["1990-05-15", "08:30", BANGKOK, "ภาพรวมปีนี้", "2026-06-19"],
  compat: ["1990-05-15", "1992-03-20"],
  timing: ["ขึ้นบ้านใหม่", "2025-05"],
  // chinese
  bazi: [], // fullRoute — no-op engine, not exercised through the Section pipeline
  zodiacyear: ["2535", "1990-05-15"],
  kua: ["2535", "ชาย", "1990-05-15"],
  zodiaccompat: ["ชวด", "ฉลู"],
  // daily
  birthday: ["1990-05-15"],
  rasi: ["1990-05-15"],
  luckycolor: ["จันทร์", "การงาน"],
  dream: ["ฝันเห็นงูใหญ่สีเขียว"],
};

const EXPECTED_IDS = [
  "phone", "license", "idcard", "findlucky", "grader",
  "nameanalyze", "namesuggest", "kalakini",
  "natal", "ascendant", "num7", "lifegraph", "compat", "timing",
  "bazi", "zodiacyear", "kua", "zodiaccompat",
  "birthday", "rasi", "luckycolor", "dream",
];

describe("registry sweep — cross-feature gate", () => {
  it("registry holds exactly the 22 expected features", () => {
    expect(Object.keys(FEATURES)).toHaveLength(22);
    for (const id of EXPECTED_IDS) {
      expect(FEATURES[id], `missing feature: ${id}`).toBeDefined();
    }
  });

  it("every expected id has a SAMPLE", () => {
    for (const id of EXPECTED_IDS) {
      expect(SAMPLES[id], `missing SAMPLE for: ${id}`).toBeDefined();
    }
  });

  it("bazi is the only fullRoute feature and routes to the full page", () => {
    expect(FEATURES["bazi"].fullRoute).toBe(true);
    for (const [id, def] of Object.entries(FEATURES)) {
      if (id !== "bazi") expect(def.fullRoute !== true, `${id} should not be fullRoute`).toBe(true);
    }
  });

  it("groupsOf() buckets sum to 22 across the 5 groups", () => {
    const g = groupsOf();
    const counts = {
      numbers: g.numbers.length,
      names: g.names.length,
      astro: g.astro.length,
      chinese: g.chinese.length,
      daily: g.daily.length,
    };
    const total = counts.numbers + counts.names + counts.astro + counts.chinese + counts.daily;
    expect(total).toBe(22);
  });

  // For each pipeline feature: valid sample → ReportSchema passes, output is
  // non-degenerate (not the note-only fallback), and the build is deterministic.
  for (const id of EXPECTED_IDS) {
    const def = FEATURES[id];
    if (def?.fullRoute === true) continue;

    describe(`${id}`, () => {
      it("valid sample passes ReportSchema", () => {
        expect(() => ReportSchema.parse(def.engine.build(SAMPLES[id]))).not.toThrow();
      });

      it("valid sample is non-degenerate (emits a non-note section)", () => {
        const out = def.engine.build(SAMPLES[id]);
        expect(
          out.some((s) => s.kind !== "note"),
          `${id} fell back to a note-only report — the SAMPLE is invalid for this engine`,
        ).toBe(true);
      });

      it("is deterministic (JSON-stable)", () => {
        const a = def.engine.build(SAMPLES[id]);
        const b = def.engine.build(SAMPLES[id]);
        expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      });
    });
  }
});
