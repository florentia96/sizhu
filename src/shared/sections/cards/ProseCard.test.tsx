import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProseCard } from "./ProseCard";

describe("ProseCard", () => {
  it("renders title and each paragraph (with and without heading)", () => {
    render(
      <ProseCard
        section={{
          kind: "prose",
          title: "ภาพรวมดวงชะตา",
          glyph: "文",
          accent: "#7da6d8",
          paras: [
            { h: "ลัคนา", t: "ลัคนาสถิตราศีเมษ บุคลิกกล้าตัดสินใจ" },
            { t: "ย่อหน้าไม่มีหัวข้อย่อย" },
          ],
        }}
        accent="#7da6d8"
      />,
    );
    expect(screen.getByText("ภาพรวมดวงชะตา")).toBeInTheDocument();
    expect(screen.getByText("ลัคนา")).toBeInTheDocument();
    expect(screen.getByText("ลัคนาสถิตราศีเมษ บุคลิกกล้าตัดสินใจ")).toBeInTheDocument();
    expect(screen.getByText("ย่อหน้าไม่มีหัวข้อย่อย")).toBeInTheDocument();
  });

  it("does not render a heading element for a paragraph without h", () => {
    render(
      <ProseCard section={{ kind: "prose", title: "t", glyph: "文", paras: [{ t: "only body" }] }} accent="#7da6d8" />,
    );
    expect(screen.getByText("only body")).toBeInTheDocument();
    expect(screen.queryByText("ลัคนา")).toBeNull();
  });
});
