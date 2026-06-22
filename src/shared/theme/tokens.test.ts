/// <reference types="node" />
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(
  resolve(process.cwd(), "src/shared/theme/tokens.css"),
  "utf8",
);

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

const TOKENS = [
  "--bg", "--bg-grad-top", "--surface", "--surface-inset", "--border-gold",
  "--primary", "--primary-shadow", "--primary-bright",
  "--gold", "--jade", "--star", "--ame",
  "--text", "--text-strong", "--text-muted", "--text-dim", "--text-faint",
  "--radius-card", "--radius-input", "--shadow",
];

// ค่าโทน "น้ำเงินคราม" (light = ค่าเริ่มต้น) — soft dark กำหนดแยกใน [data-theme="dark"]
const VALUES: Record<string, string> = {
  "--bg": "#eef1fb",
  "--bg-grad-top": "#e0e8ff",
  "--primary": "#3f5fd4",
  "--primary-shadow": "#2f48ad",
  "--primary-bright": "#5a73e4",
  "--gold": "#bf9555",
  "--jade": "#4f9d80",
  "--star": "#2f93a8",
  "--ame": "#5466ad",
  "--text": "#474d68",
  "--text-strong": "#313548",
  "--text-muted": "#686f8a",
  "--text-dim": "#868ca4",
  "--text-faint": "#9ea4bb",
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

  it("loads Mitr (headings) + Noto Serif SC (Chinese glyphs) + Anuphan (Thai, loopless) from Google Fonts in index.html", () => {
    expect(html).toContain("fonts.googleapis.com");
    expect(html).toContain("Mitr");
    expect(html).toContain("Noto+Serif+SC");
    expect(html).toContain("Anuphan");
  });

  it("does not pull fonts via CSS @import — fonts load once from the index.html <link>", () => {
    expect(css).not.toMatch(/@import\s+url\(/);
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
