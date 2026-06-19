import { describe, it, expect } from "vitest";
import { parsePath, buildPath, hrefFor, relFromLocation, type Route } from "./routes";

const BASE_NOSLASH = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");

describe("parsePath", () => {
  it("maps empty / root / unknown to hub", () => {
    expect(parsePath("")).toEqual({ name: "hub" });
    expect(parsePath("/")).toEqual({ name: "hub" });
    expect(parsePath("/garbage")).toEqual({ name: "hub" });
  });

  it("parses a feature route", () => {
    expect(parsePath("/f/phone")).toEqual({ name: "feature", id: "phone" });
    expect(parsePath("/f/luckycolor")).toEqual({ name: "feature", id: "luckycolor" });
  });

  it("parses bazi with and without params", () => {
    expect(parsePath("/bazi")).toEqual({ name: "bazi" });
    expect(parsePath("/bazi?bd=1990-05-12&bt=08%3A30")).toEqual({
      name: "bazi",
      params: { bd: "1990-05-12", bt: "08:30" },
    });
  });

  it("parses the design-system route", () => {
    expect(parsePath("/ds")).toEqual({ name: "ds" });
  });

  it("tolerates a missing leading slash", () => {
    expect(parsePath("f/phone")).toEqual({ name: "feature", id: "phone" });
  });
});

describe("buildPath", () => {
  it("builds each route shape (base-relative)", () => {
    expect(buildPath({ name: "hub" })).toBe("/");
    expect(buildPath({ name: "feature", id: "phone" })).toBe("/f/phone");
    expect(buildPath({ name: "ds" })).toBe("/ds");
    expect(buildPath({ name: "bazi" })).toBe("/bazi");
    expect(buildPath({ name: "bazi", params: { bd: "1990-05-12", bt: "08:30" } })).toBe(
      "/bazi?bd=1990-05-12&bt=08%3A30",
    );
  });
});

describe("hrefFor / relFromLocation honor the app base", () => {
  it("hrefFor prefixes the base", () => {
    expect(hrefFor({ name: "feature", id: "phone" })).toBe(`${BASE_NOSLASH}/f/phone`);
    expect(hrefFor({ name: "hub" })).toBe(BASE_NOSLASH ? `${BASE_NOSLASH}/` : "/");
  });

  it("relFromLocation strips the base so an emitted href round-trips", () => {
    const r: Route = { name: "feature", id: "dream" };
    expect(parsePath(relFromLocation(hrefFor(r)))).toEqual(r);
  });

  it("relFromLocation keeps the query for bazi", () => {
    const r: Route = { name: "bazi", params: { bd: "1990-05-12" } };
    const href = hrefFor(r); // ".../bazi?bd=1990-05-12"
    const [path, search] = href.split("?");
    expect(parsePath(relFromLocation(path, "?" + search))).toEqual(r);
  });
});

describe("round-trip", () => {
  const cases: Route[] = [
    { name: "hub" },
    { name: "feature", id: "phone" },
    { name: "feature", id: "zodiaccompat" },
    { name: "ds" },
    { name: "bazi" },
    { name: "bazi", params: { bd: "1990-05-12", bt: "08:30" } },
  ];
  it("parsePath(buildPath(route)) === route", () => {
    for (const r of cases) {
      expect(parsePath(buildPath(r))).toEqual(r);
    }
  });
  it("buildPath(parsePath(path)) === path", () => {
    const paths = ["/", "/f/phone", "/ds", "/bazi", "/bazi?bd=1990-05-12&bt=08%3A30"];
    for (const p of paths) {
      expect(buildPath(parsePath(p))).toBe(p);
    }
  });
});
