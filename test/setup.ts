import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom ไม่ implement APIs เหล่านี้ (browser จริงมีครบ) — mock ให้ test output สะอาด
window.scrollTo = vi.fn();
HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockReturnValue(null) as unknown as HTMLCanvasElement["getContext"];

// jsdom ไม่มี matchMedia — mock ให้ usePrefersReducedMotion ทำงานได้ (ดีฟอลต์ = ไม่ลดการเคลื่อนไหว)
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom คอนฟิกนี้ไม่ได้เปิด localStorage — ใส่ in-memory polyfill ให้ profile store ทดสอบได้ (browser จริงมีครบ)
if (!globalThis.localStorage) {
  let store: Record<string, string> = {};
  const mem = {
    getItem: (k: string) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
  Object.defineProperty(globalThis, "localStorage", { value: mem, configurable: true, writable: true });
}
