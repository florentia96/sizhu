import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Starfield } from "./Starfield";

describe("Starfield", () => {
  it("renders two fixed, non-interactive background layers", () => {
    const { container } = render(<Starfield />);
    const layers = container.querySelectorAll("div");
    expect(layers.length).toBe(2);
    layers.forEach((el) => {
      const style = (el as HTMLElement).style;
      expect(style.position).toBe("fixed");
      expect(style.pointerEvents).toBe("none");
      expect(style.zIndex).toBe("0");
    });
  });

  it("uses the spec radial gradient on the base layer", () => {
    const { container } = render(<Starfield />);
    const base = container.querySelector("div") as HTMLElement;
    expect(base.style.backgroundImage).toContain("radial-gradient");
    expect(base.style.backgroundImage).toContain("circle at 50% -8%");
  });

  it("applies the twinkle animation to the star layer", () => {
    const { container } = render(<Starfield />);
    const star = container.querySelectorAll("div")[1] as HTMLElement;
    expect(star.style.animation).toContain("twinkle");
  });
});
