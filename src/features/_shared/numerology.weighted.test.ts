import { describe, it, expect } from "vitest";
import {
  analyzeNumber,
  analyzeNumberWeighted,
  numberReportWeighted,
} from "./numerology";
import { ReportSchema } from "../../shared/sections/types";

describe("positional weighting (deepen)", () => {
  // multiset of "140" = {14 good, 40 bad}; multiset of "041" = {04 bad, 41 good}
  // tones match exactly {good, bad}; good pair is LAST in "041", FIRST in "140".
  const GOOD_FIRST = "140"; // 14(good), 40(bad)
  const GOOD_LAST = "041"; // 04(bad), 41(good)

  it("plain analyzeNumber gives both the same score (position-blind)", () => {
    expect(analyzeNumber(GOOD_FIRST).score).toBe(analyzeNumber(GOOD_LAST).score);
    expect(analyzeNumber(GOOD_FIRST).good).toBe(1);
    expect(analyzeNumber(GOOD_FIRST).bad).toBe(1);
    expect(analyzeNumber(GOOD_LAST).good).toBe(1);
    expect(analyzeNumber(GOOD_LAST).bad).toBe(1);
  });

  it("weighted score is strictly higher when the good pair is last", () => {
    const last = analyzeNumberWeighted(GOOD_LAST).weightedScore;
    const first = analyzeNumberWeighted(GOOD_FIRST).weightedScore;
    expect(last).toBeGreaterThan(first);
  });

  it("weighted analysis preserves the unweighted fields and adds weightedScore", () => {
    const a = analyzeNumberWeighted(GOOD_LAST);
    const plain = analyzeNumber(GOOD_LAST);
    expect(a.good).toBe(plain.good);
    expect(a.bad).toBe(plain.bad);
    expect(a.total).toBe(plain.total);
    expect(typeof a.weightedScore).toBe("number");
    expect(a.weightedScore).toBeGreaterThanOrEqual(22);
    expect(a.weightedScore).toBeLessThanOrEqual(98);
  });

  it("weighted report satisfies ReportSchema and is deterministic", () => {
    const r = numberReportWeighted("0812345678", "เบอร์โทร", "數");
    expect(() => ReportSchema.parse(r)).not.toThrow();
    expect(r).toEqual(numberReportWeighted("0812345678", "เบอร์โทร", "數"));
  });

  it("does not regress the unweighted port (phone reference vector stays 78)", () => {
    expect(analyzeNumber("0812345678").score).toBe(78);
  });
});
