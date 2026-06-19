import { describe, it, expect } from "vitest";
import { parseBaziParams } from "../src/screens/baziParams";

describe("parseBaziParams: prefill from ?bd=&bt=", () => {
  it("no params → no prefill, no autocast", () => {
    expect(parseBaziParams("")).toEqual({ autocast: false });
  });

  it("bd only → date set, time undefined, autocast true (mirrors legacy: bd present ⇒ casting)", () => {
    expect(parseBaziParams("bd=1996-04-03")).toEqual({
      date: "1996-04-03", autocast: true,
    });
  });

  it("bd + bt → both set, autocast true", () => {
    expect(parseBaziParams("?bd=1996-04-03&bt=23:58")).toEqual({
      date: "1996-04-03", time: "23:58", autocast: true,
    });
  });

  it("tolerates leading '?' and URL-encoding", () => {
    expect(parseBaziParams("?bd=2000-01-01&bt=09%3A05")).toEqual({
      date: "2000-01-01", time: "09:05", autocast: true,
    });
  });

  it("bt without bd → ignored, no autocast (legacy: only bd triggers prefill)", () => {
    expect(parseBaziParams("bt=12:00")).toEqual({ autocast: false });
  });

  it("malformed bd (not YYYY-MM-DD) → no prefill, no autocast", () => {
    expect(parseBaziParams("bd=03/04/1996")).toEqual({ autocast: false });
  });

  it("malformed bt → date kept, time dropped, still autocast", () => {
    expect(parseBaziParams("bd=1996-04-03&bt=2558")).toEqual({
      date: "1996-04-03", autocast: true,
    });
  });
});
