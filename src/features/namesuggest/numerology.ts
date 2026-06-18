import { THAI_LETTER_VALUE } from "./content";

function digitRoot(n: number): number {
  let x = n;
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

export function nameSum(raw: string): { sum: number; reduced: number } {
  let sum = 0;
  for (const ch of raw) {
    const v = THAI_LETTER_VALUE[ch];
    if (v !== undefined) sum += v;
  }
  return { sum, reduced: digitRoot(sum) };
}
