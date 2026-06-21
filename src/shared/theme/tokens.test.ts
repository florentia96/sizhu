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

// ค่าโทน "ฟ้าอรุณ" (light = ค่าเริ่มต้น) — soft dark กำหนดแยกใน [data-theme="dark"]
const VALUES: Record<string, string> = {
  "--bg": "#f4eef9",
  "--bg-grad-top": "#ffe7dc",
  "--primary": "#b86bb0",
  "--primary-shadow": "#9a5390",
  "--primary-bright": "#c982bf",
  "--gold": "#bf9555",
  "--jade": "#4f9d80",
  "--star": "#5f80c8",
  "--ame": "#9d6fc4",
  "--text": "#4f4a63",
  "--text-strong": "#38324a",
  "--text-muted": "#6f6a86",
  "--text-dim": "#8a86a0",
  "--text-faint": "#a39fb6",
  "--radius-card": "22px",
  "--radius-input": "14px",
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

  it("sets the body background and an aurora radial gradient", () => {
    expect(css).toMatch(/body\s*\{/);
    expect(css).toContain("var(--bg)");
    expect(css).toContain("radial-gradient");
    expect(css).toContain("var(--aurora-1)");
  });

  it("provides a light and a dark theme block", () => {
    expect(css).toMatch(/\[data-theme="light"\]/);
    expect(css).toMatch(/\[data-theme="dark"\]/);
  });
});
