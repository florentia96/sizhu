import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DesignSystem } from "./DesignSystem";

describe("DesignSystem", () => {
  it("renders the design-system heading", () => {
    render(<DesignSystem onHome={() => {}} />);
    expect(screen.getByText(/Design System/)).toBeInTheDocument();
  });

  it("renders the full palette including each accent hex", () => {
    render(<DesignSystem onHome={() => {}} />);
    for (const hex of ["#b1352a", "#e0584b", "#d8a64a", "#6cc18a", "#7da6d8", "#c98ad8"]) {
      expect(screen.getByText(hex)).toBeInTheDocument();
    }
  });

  it("fires onHome from the back button", () => {
    const onHome = vi.fn();
    render(<DesignSystem onHome={onHome} />);
    fireEvent.click(screen.getByRole("button", { name: /กลับหน้าแรก/ }));
    expect(onHome).toHaveBeenCalledTimes(1);
  });
});
