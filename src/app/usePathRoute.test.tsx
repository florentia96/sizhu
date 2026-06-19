import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePathRoute } from "./usePathRoute";
import { hrefFor, type Route } from "./routes";

function go(route: Route): void {
  window.history.pushState(null, "", hrefFor(route));
}

describe("usePathRoute", () => {
  beforeEach(() => {
    go({ name: "hub" });
  });

  it("returns hub at the base path", () => {
    const { result } = renderHook(() => usePathRoute());
    expect(result.current.route).toEqual({ name: "hub" });
  });

  it("reflects the current path on mount", () => {
    go({ name: "feature", id: "phone" });
    const { result } = renderHook(() => usePathRoute());
    expect(result.current.route).toEqual({ name: "feature", id: "phone" });
  });

  it("updates on popstate (browser back/forward)", () => {
    const { result } = renderHook(() => usePathRoute());
    act(() => {
      window.history.pushState(null, "", hrefFor({ name: "ds" }));
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(result.current.route).toEqual({ name: "ds" });
  });

  it("navigate() pushes the path and updates the route", () => {
    const { result } = renderHook(() => usePathRoute());
    act(() => {
      result.current.navigate({ name: "feature", id: "dream" });
    });
    expect(window.location.pathname).toBe(hrefFor({ name: "feature", id: "dream" }));
    expect(result.current.route).toEqual({ name: "feature", id: "dream" });
  });
});
