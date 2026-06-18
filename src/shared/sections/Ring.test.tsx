import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Ring } from "./Ring";

const CIRC = 2 * Math.PI * 66;

function circles(container: HTMLElement) {
  return Array.from(container.querySelectorAll("circle"));
}

describe("Ring", () => {
  it("renders an svg with viewBox 0 0 150 150 rotated -90deg", () => {
    const { container } = render(<Ring pct={50} color="#6cc18a" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("viewBox")).toBe("0 0 150 150");
    expect(svg.style.transform).toBe("rotate(-90deg)");
  });

  it("draws a track circle and a colored arc circle, r=66 strokeWidth 11", () => {
    const { container } = render(<Ring pct={50} color="#6cc18a" />);
    const cs = circles(container);
    expect(cs.length).toBe(2);
    for (const c of cs) {
      expect(c.getAttribute("r")).toBe("66");
      expect(c.getAttribute("stroke-width")).toBe("11");
      expect(c.getAttribute("cx")).toBe("75");
      expect(c.getAttribute("cy")).toBe("75");
    }
    expect(cs[0].getAttribute("stroke")).toBe("rgba(255,255,255,.08)");
    expect(cs[1].getAttribute("stroke")).toBe("#6cc18a");
  });

  it("sets dashoffset = circ - dash for the given pct", () => {
    const { container } = render(<Ring pct={50} color="#6cc18a" />);
    const arc = circles(container)[1];
    const dash = (CIRC * 50) / 100;
    expect(Number(arc.getAttribute("stroke-dasharray"))).toBeCloseTo(CIRC, 6);
    expect(Number(arc.getAttribute("stroke-dashoffset"))).toBeCloseTo(CIRC - dash, 6);
  });

  it("clamps pct above 100 to a full arc (dashoffset 0)", () => {
    const { container } = render(<Ring pct={140} color="#6cc18a" />);
    const arc = circles(container)[1];
    expect(Number(arc.getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 6);
  });

  it("clamps negative pct to an empty arc (dashoffset = circ)", () => {
    const { container } = render(<Ring pct={-20} color="#6cc18a" />);
    const arc = circles(container)[1];
    expect(Number(arc.getAttribute("stroke-dashoffset"))).toBeCloseTo(CIRC, 6);
  });
});
