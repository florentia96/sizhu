import { describe, it, expect } from "vitest";
import { KUA_DIR } from "./content";

/**
 * Correctness guard for KUA_DIR.
 *
 * The 8 wandering stars of Eight Mansions (BaZhai / DaYouNian) are derived by flipping
 * specific lines (yao) of the natal trigram. We re-derive the whole table from
 * the classical line-change rules and assert it equals the shipped KUA_DIR.
 *
 * Rules (line index: 0=bottom, 1=middle, 2=top), each value = which lines flip:
 *   ShengQi = top            -> proven via Kan/Li agreed good directions
 *   TianYi  = bottom+middle  -> proven via Kan/Li agreed good directions
 *   YanNian = all three      -> proven via Kan/Li agreed good directions
 *   FuWei   = none
 *   HuoHai  = bottom
 *   WuGui   = middle+top     -> classical: Xun -> Kun (SW)
 *   LiuSha  = bottom+top     -> classical: Qian -> Kan (N)
 *   JueMing = middle         -> classical: Gen -> Xun (SE)
 */
const TRI: Record<string, number[]> = {
  NW: [1, 1, 1], W: [1, 1, 0], S: [1, 0, 1], E: [1, 0, 0],
  SE: [0, 1, 1], N: [0, 1, 0], NE: [0, 0, 1], SW: [0, 0, 0],
};
const dirOf = (bits: number[]): string =>
  Object.keys(TRI).find((d) => TRI[d].join("") === bits.join(""))!;
const flip = (bits: number[], mask: number[]): number[] =>
  bits.map((b, i) => (mask[i] ? b ^ 1 : b));

const KUA_TRI: Record<number, string> = {
  1: "N", 2: "SW", 3: "E", 4: "SE", 6: "NW", 7: "W", 8: "NE", 9: "S",
};
// order matches KUA_DIR: [ShengQi, TianYi, YanNian, FuWei, HuoHai, WuGui, LiuSha, JueMing]
const MASKS: number[][] = [
  [0, 0, 1], [1, 1, 0], [1, 1, 1], [0, 0, 0],
  [1, 0, 0], [0, 1, 1], [1, 0, 1], [0, 1, 0],
];

describe("kua directions derive from trigram line-changes (大遊年)", () => {
  it("classical worked examples hold", () => {
    expect(dirOf(flip(TRI.SE, [0, 1, 1]))).toBe("SW"); // WuGui:  Xun -> Kun
    expect(dirOf(flip(TRI.NW, [1, 0, 1]))).toBe("N"); // LiuSha: Qian -> Kan
    expect(dirOf(flip(TRI.NE, [0, 1, 0]))).toBe("SE"); // JueMing: Gen -> Xun
  });

  it("derived 8 directions equal shipped KUA_DIR for every kua", () => {
    for (const k of [1, 2, 3, 4, 6, 7, 8, 9]) {
      const natal = TRI[KUA_TRI[k]];
      const derived = MASKS.map((m) => dirOf(flip(natal, m)));
      expect(KUA_DIR[k]).toEqual(derived);
    }
  });

  it("good directions match the universally-agreed East/West group sets", () => {
    const EAST = new Set(["N", "S", "E", "SE"]);
    const WEST = new Set(["W", "NW", "SW", "NE"]);
    for (const k of [1, 3, 4, 9]) {
      KUA_DIR[k].slice(0, 4).forEach((d) => expect(EAST.has(d)).toBe(true));
    }
    for (const k of [2, 6, 7, 8]) {
      KUA_DIR[k].slice(0, 4).forEach((d) => expect(WEST.has(d)).toBe(true));
    }
  });

  it("each kua uses all 8 directions exactly once (no duplicates)", () => {
    for (const k of [1, 2, 3, 4, 6, 7, 8, 9]) {
      expect(new Set(KUA_DIR[k]).size).toBe(8);
    }
  });
});
