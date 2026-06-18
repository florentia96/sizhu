import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardsCard } from "./CardsCard";

describe("CardsCard", () => {
  it("renders title, subtitle and each item value/badge/note", () => {
    render(
      <CardsCard
        section={{
          kind: "cards",
          title: "เลขแนะนำ",
          glyph: "尋",
          subtitle: "คัดผลรวมเกรด A ขึ้นไป",
          accent: "#6cc18a",
          items: [
            { value: "089-356-9789", badge: "A+", note: "ผลรวม 64" },
            { value: "062-456-5639", badge: "A", note: "ผลรวม 50" },
          ],
        }}
        accent="#6cc18a"
      />,
    );
    expect(screen.getByText("เลขแนะนำ")).toBeInTheDocument();
    expect(screen.getByText("คัดผลรวมเกรด A ขึ้นไป")).toBeInTheDocument();
    expect(screen.getByText("089-356-9789")).toBeInTheDocument();
    expect(screen.getByText("A+")).toBeInTheDocument();
    expect(screen.getByText("ผลรวม 64")).toBeInTheDocument();
    expect(screen.getByText("062-456-5639")).toBeInTheDocument();
  });

  it("omits subtitle, badge and note when absent", () => {
    render(
      <CardsCard
        section={{ kind: "cards", title: "t", glyph: "x", items: [{ value: "0123" }] }}
        accent="#6cc18a"
      />,
    );
    expect(screen.getByText("0123")).toBeInTheDocument();
    expect(screen.queryByText("A+")).toBeNull();
  });

  it("colors the badge with section.accent", () => {
    render(
      <CardsCard
        section={{ kind: "cards", title: "t", glyph: "x", accent: "#d8a64a", items: [{ value: "v", badge: "B" }] }}
        accent="#6cc18a"
      />,
    );
    expect(screen.getByText("B")).toHaveStyle({ color: "#d8a64a" });
  });
});
