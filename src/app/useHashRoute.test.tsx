import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHashRoute } from "./useHashRoute";

describe("useHashRoute", () => {
  beforeEach(() => {
    window.location.hash = "";
  });
  afterEach(() => {
    window.location.hash = "";
  });

  it("returns hub for an empty hash", () => {
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.route).toEqual({ name: "hub" });
  });

  it("reflects the current hash on mount", () => {
    window.location.hash = "#/f/phone";
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.route).toEqual({ name: "feature", id: "phone" });
  });

  it("updates when the hash changes", () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => {
      window.location.hash = "#/ds";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(result.current.route).toEqual({ name: "ds" });
  });

  it("navigate() writes the hash and updates the route", () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => {
      result.current.navigate({ name: "feature", id: "dream" });
    });
    expect(window.location.hash).toBe("#/f/dream");
    expect(result.current.route).toEqual({ name: "feature", id: "dream" });
  });
});
