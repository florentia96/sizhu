import { describe, it, expect } from "vitest";
import { parseHash, buildHash, type Route } from "./routes";

describe("parseHash", () => {
  it("maps empty / root / unknown to hub", () => {
    expect(parseHash("")).toEqual({ name: "hub" });
    expect(parseHash("#")).toEqual({ name: "hub" });
    expect(parseHash("#/")).toEqual({ name: "hub" });
    expect(parseHash("#/garbage")).toEqual({ name: "hub" });
  });

  it("parses a feature route", () => {
    expect(parseHash("#/f/phone")).toEqual({ name: "feature", id: "phone" });
    expect(parseHash("#/f/luckycolor")).toEqual({ name: "feature", id: "luckycolor" });
  });

  it("parses bazi with and without params", () => {
    expect(parseHash("#/bazi")).toEqual({ name: "bazi" });
    expect(parseHash("#/bazi?bd=1990-05-12&bt=08%3A30")).toEqual({
      name: "bazi",
      params: { bd: "1990-05-12", bt: "08:30" },
    });
  });

  it("parses the design-system route", () => {
    expect(parseHash("#/ds")).toEqual({ name: "ds" });
  });

  it("tolerates a missing leading hash", () => {
    expect(parseHash("/f/phone")).toEqual({ name: "feature", id: "phone" });
  });
});

describe("buildHash", () => {
  it("builds each route shape", () => {
    expect(buildHash({ name: "hub" })).toBe("#/");
    expect(buildHash({ name: "feature", id: "phone" })).toBe("#/f/phone");
    expect(buildHash({ name: "ds" })).toBe("#/ds");
    expect(buildHash({ name: "bazi" })).toBe("#/bazi");
    expect(buildHash({ name: "bazi", params: { bd: "1990-05-12", bt: "08:30" } })).toBe(
      "#/bazi?bd=1990-05-12&bt=08%3A30",
    );
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
  it("parseHash(buildHash(route)) === route", () => {
    for (const r of cases) {
      expect(parseHash(buildHash(r))).toEqual(r);
    }
  });
  it("buildHash(parseHash(hash)) === hash", () => {
    const hashes = ["#/", "#/f/phone", "#/ds", "#/bazi", "#/bazi?bd=1990-05-12&bt=08%3A30"];
    for (const h of hashes) {
      expect(buildHash(parseHash(h))).toBe(h);
    }
  });
});
