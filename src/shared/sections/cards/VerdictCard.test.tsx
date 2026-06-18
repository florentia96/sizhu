import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerdictCard } from "./VerdictCard";

describe("VerdictCard", () => {
  it("shows score, grade·gradeLabel and summary", () => {
    render(
      <VerdictCard
        section={{ kind: "verdict", score: 86, grade: "A", gradeLabel: "ดีมาก", summary: "เบอร์โดดเด่นด้านการเงิน", meta: "ผลรวม 54", accent: "#6cc18a" }}
        accent="#6cc18a"
      />,
    );
    expect(screen.getByText("86")).toBeInTheDocument();
    expect(screen.getByText(/A · ดีมาก/)).toBeInTheDocument();
    expect(screen.getByText("เบอร์โดดเด่นด้านการเงิน")).toBeInTheDocument();
    expect(screen.getByText("ผลรวม 54")).toBeInTheDocument();
  });

  it("renders the ring (svg) by default", () => {
    const { container } = render(
      <VerdictCard section={{ kind: "verdict", score: 70, grade: "B", gradeLabel: "ดี", summary: "x" }} accent="#7da6d8" />,
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("hides the ring when hideRing is true", () => {
    const { container } = render(
      <VerdictCard section={{ kind: "verdict", score: 70, grade: "B", gradeLabel: "ดี", summary: "x", hideRing: true }} accent="#7da6d8" />,
    );
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.queryByText("70")).toBeNull();
  });

  it("uses section.accent over the prop accent when provided", () => {
    render(
      <VerdictCard section={{ kind: "verdict", score: 90, grade: "A+", gradeLabel: "ยอด", summary: "x", accent: "#e0584b" }} accent="#6cc18a" />,
    );
    const score = screen.getByText("90");
    expect(score).toHaveStyle({ color: "#e0584b" });
  });
});
