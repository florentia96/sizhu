import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GridCard } from "./GridCard";

describe("GridCard", () => {
  it("renders title and every cell name/value/note", () => {
    render(
      <GridCard
        section={{
          kind: "grid",
          title: "สี่เสา",
          glyph: "柱",
          accent: "#7da6d8",
          cells: [
            { name: "เสาปี", value: "甲子", note: "ธาตุไม้" },
            { name: "เสาวัน", value: "丙午" },
          ],
        }}
        accent="#6cc18a"
      />,
    );
    expect(screen.getByText("สี่เสา")).toBeInTheDocument();
    expect(screen.getByText("เสาปี")).toBeInTheDocument();
    expect(screen.getByText("甲子")).toBeInTheDocument();
    expect(screen.getByText("ธาตุไม้")).toBeInTheDocument();
    expect(screen.getByText("เสาวัน")).toBeInTheDocument();
    expect(screen.getByText("丙午")).toBeInTheDocument();
  });

  it("colors values with section.accent when present", () => {
    render(
      <GridCard
        section={{ kind: "grid", title: "t", glyph: "x", accent: "#7da6d8", cells: [{ name: "n", value: "v" }] }}
        accent="#6cc18a"
      />,
    );
    expect(screen.getByText("v")).toHaveStyle({ color: "#7da6d8" });
  });

  it("falls back to the prop accent when section.accent is absent", () => {
    render(
      <GridCard section={{ kind: "grid", title: "t", glyph: "x", cells: [{ name: "n", value: "v" }] }} accent="#6cc18a" />,
    );
    expect(screen.getByText("v")).toHaveStyle({ color: "#6cc18a" });
  });
});
