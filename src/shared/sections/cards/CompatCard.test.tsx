import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompatCard } from "./CompatCard";

describe("CompatCard", () => {
  it("renders score%, label, both names and each point", () => {
    render(
      <CompatCard
        section={{
          kind: "compat",
          score: 78,
          label: "เข้ากันดี",
          a: "วันจันทร์",
          b: "วันศุกร์",
          accent: "#c98ad8",
          points: [
            { title: "ธาตุเสริมกัน", meaning: "ดินกับทองหนุนเสริม", fg: "#6cc18a" },
            { title: "ระวังการสื่อสาร", meaning: "จังหวะพูดต่างกัน", fg: "#d8a64a" },
          ],
        }}
        accent="#c98ad8"
      />,
    );
    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getByText("เข้ากันดี")).toBeInTheDocument();
    expect(screen.getByText("วันจันทร์")).toBeInTheDocument();
    expect(screen.getByText("วันศุกร์")).toBeInTheDocument();
    expect(screen.getByText("ธาตุเสริมกัน")).toBeInTheDocument();
    expect(screen.getByText("ดินกับทองหนุนเสริม")).toBeInTheDocument();
    expect(screen.getByText("ระวังการสื่อสาร")).toBeInTheDocument();
  });

  it("renders the ring svg", () => {
    const { container } = render(
      <CompatCard
        section={{ kind: "compat", score: 50, label: "กลาง", a: "A", b: "B", points: [] }}
        accent="#c98ad8"
      />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("colors a point title with its fg", () => {
    render(
      <CompatCard
        section={{ kind: "compat", score: 60, label: "l", a: "A", b: "B", points: [{ title: "ระวัง", meaning: "m", fg: "#e0584b" }] }}
        accent="#c98ad8"
      />,
    );
    expect(screen.getByText("ระวัง")).toHaveStyle({ color: "#e0584b" });
  });
});
