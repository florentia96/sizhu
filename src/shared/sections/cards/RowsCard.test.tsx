import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RowsCard } from "./RowsCard";

describe("RowsCard", () => {
  it("renders title, glyph and every item (n, title, meaning)", () => {
    render(
      <RowsCard
        section={{
          kind: "rows",
          title: "คู่เลขเด่น",
          glyph: "號",
          items: [
            { n: "56", title: "ทรัพย์ & เสน่ห์", meaning: "ดึงดูดเงินทองและผู้คน", fg: "#6cc18a" },
            { n: "42", title: "ระวังรายจ่าย", meaning: "อาจมีค่าใช้จ่ายไม่คาดคิด", fg: "#e0584b" },
          ],
        }}
      />,
    );
    expect(screen.getByText("คู่เลขเด่น")).toBeInTheDocument();
    expect(screen.getByText("號")).toBeInTheDocument();
    expect(screen.getByText("56")).toBeInTheDocument();
    expect(screen.getByText("ทรัพย์ & เสน่ห์")).toBeInTheDocument();
    expect(screen.getByText("ดึงดูดเงินทองและผู้คน")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("colors the badge box and title with item.fg", () => {
    render(
      <RowsCard
        section={{ kind: "rows", title: "t", glyph: "x", items: [{ n: "07", title: "ควรเลี่ยง", meaning: "m", fg: "#e0584b" }] }}
      />,
    );
    expect(screen.getByText("ควรเลี่ยง")).toHaveStyle({ color: "#e0584b" });
    expect(screen.getByText("07")).toHaveStyle({ color: "#e0584b" });
  });
});
