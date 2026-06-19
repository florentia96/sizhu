/// <reference types="node" />
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(
  resolve(process.cwd(), "src/shared/theme/tokens.css"),
  "utf8",
);

const TOKENS = [
  "--bg", "--bg-grad-top", "--surface", "--surface-inset", "--border-gold",
  "--primary", "--primary-shadow", "--primary-bright",
  "--gold", "--jade", "--star", "--ame",
  "--text", "--text-strong", "--text-muted", "--text-dim", "--text-faint",
  "--radius-card", "--radius-input", "--shadow",
];

const VALUES: Record<string, string> = {
  "--bg": "#0e1116",
  "--bg-grad-top": "#1c2433",
  "--primary": "#b1352a",
  "--primary-shadow": "#8a2820",
  "--primary-bright": "#e0584b",
  "--gold": "#d8a64a",
  "--jade": "#6cc18a",
  "--star": "#7da6d8",
  "--ame": "#c98ad8",
  "--text": "#e7dcc2",
  "--text-strong": "#f4ecd9",
  "--text-muted": "#b9b2a0",
  "--text-dim": "#8a8474",
  "--text-faint": "#6f6a5c",
  "--radius-card": "5px",
  "--radius-input": "4px",
};

describe("tokens.css", () => {
  it("declares every required custom property", () => {
    for (const t of TOKENS) {
      expect(css, `missing token ${t}`).toContain(`${t}:`);
    }
  });

  it("uses the exact spec §6 values for fixed tokens", () => {
    for (const [k, v] of Object.entries(VALUES)) {
      expect(css, `token ${k} should be ${v}`).toContain(`${k}: ${v}`);
    }
  });

  it("imports Noto Serif SC (Chinese glyphs) + Anuphan (Thai, loopless) from Google Fonts", () => {
    expect(css).toContain("fonts.googleapis.com");
    expect(css).toContain("Noto+Serif+SC");
    expect(css).toContain("Anuphan");
  });

  it("sets the body background and a radial gradient", () => {
    expect(css).toMatch(/body\s*\{/);
    expect(css).toContain("var(--bg)");
    expect(css).toContain("radial-gradient");
    expect(css).toContain("circle at 50% -8%");
  });
});
