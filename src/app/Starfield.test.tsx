import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Starfield } from "./Starfield";

describe("Starfield", () => {
  it("renders a single non-interactive background layer with the .starfield class", () => {
    const { container } = render(<Starfield />);
    const layers = container.querySelectorAll("div");
    expect(layers.length).toBe(1);
    const el = layers[0] as HTMLElement;
    expect(el.classList.contains("starfield")).toBe(true);
  });

  it("is hidden from assistive tech (decorative)", () => {
    const { container } = render(<Starfield />);
    const el = container.querySelector("div") as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });
});
