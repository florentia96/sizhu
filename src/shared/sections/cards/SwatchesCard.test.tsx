import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SwatchesCard } from "./SwatchesCard";

describe("SwatchesCard", () => {
  it("renders title, tag, text and each swatch name", () => {
    render(
      <SwatchesCard
        section={{
          kind: "swatches",
          title: "สีมงคล",
          glyph: "色",
          tag: "เสริมการงาน",
          accent: "#d8a64a",
          text: "สวมโทนทองเสริมบารมี",
          items: [
            { name: "ทอง", hex: "#d8a64a" },
            { name: "เขียวหยก", hex: "#6cc18a" },
          ],
        }}
        accent="#c98ad8"
      />,
    );
    expect(screen.getByText("สีมงคล")).toBeInTheDocument();
    expect(screen.getByText("เสริมการงาน")).toBeInTheDocument();
    expect(screen.getByText("สวมโทนทองเสริมบารมี")).toBeInTheDocument();
    expect(screen.getByText("ทอง")).toBeInTheDocument();
    expect(screen.getByText("เขียวหยก")).toBeInTheDocument();
  });

  it("paints each swatch dot with its hex", () => {
    const { container } = render(
      <SwatchesCard
        section={{ kind: "swatches", title: "t", glyph: "色", items: [{ name: "ทอง", hex: "#d8a64a" }] }}
        accent="#c98ad8"
      />,
    );
    const dot = container.querySelector('[data-swatch="ทอง"]') as HTMLElement;
    expect(dot).toBeTruthy();
    expect(dot).toHaveStyle({ background: "#d8a64a" });
  });

  it("omits tag and text when absent", () => {
    render(
      <SwatchesCard section={{ kind: "swatches", title: "t", glyph: "色", items: [{ name: "ทอง", hex: "#d8a64a" }] }} accent="#c98ad8" />,
    );
    expect(screen.getByText("t")).toBeInTheDocument();
  });
});
