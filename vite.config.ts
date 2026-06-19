/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { seoPlugin } from "./vite-seo-plugin";

// base ตรงกับ GitHub Pages project path: https://florentia96.github.io/sizhu/
export default defineConfig({
  base: "/sizhu/",
  plugins: [react(), seoPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.ts",
    include: [
      "test/**/*.test.{ts,tsx}",
      "src/**/*.test.{ts,tsx}",
    ],
  },
});
