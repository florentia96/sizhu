import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlocksCard } from "./BlocksCard";

describe("BlocksCard", () => {
  it("renders title, each block title, tag, text and every chip", () => {
    render(
      <BlocksCard
        section={{
          kind: "blocks",
          title: "ภาพรวมชีวิต",
          glyph: "命",
          items: [
            { title: "การเงิน", tag: "เด่น", accent: "#6cc18a", text: "หนุนรายรับสม่ำเสมอ", chips: ["ค้าขาย", "ลงทุน"] },
            { title: "สุขภาพ", tag: "ระวัง", accent: "#e0584b", text: "พักผ่อนให้พอ", chips: ["นอน", "ออกกำลัง"] },
          ],
        }}
      />,
    );
    expect(screen.getByText("ภาพรวมชีวิต")).toBeInTheDocument();
    expect(screen.getByText("การเงิน")).toBeInTheDocument();
    expect(screen.getByText("เด่น")).toBeInTheDocument();
    expect(screen.getByText("หนุนรายรับสม่ำเสมอ")).toBeInTheDocument();
    expect(screen.getByText("ค้าขาย")).toBeInTheDocument();
    expect(screen.getByText("ลงทุน")).toBeInTheDocument();
    expect(screen.getByText("สุขภาพ")).toBeInTheDocument();
    expect(screen.getByText("นอน")).toBeInTheDocument();
  });

  it("colors the tag with the block accent", () => {
    render(
      <BlocksCard
        section={{ kind: "blocks", title: "t", glyph: "x", items: [{ title: "b", tag: "เด่น", accent: "#6cc18a", text: "x", chips: [] }] }}
      />,
    );
    expect(screen.getByText("เด่น")).toHaveStyle({ color: "#6cc18a" });
  });
});
