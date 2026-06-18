/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base ตรงกับ GitHub Pages project path: https://florentia96.github.io/sizhu/
export default defineConfig({
  base: "/sizhu/",
  plugins: [react()],
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
