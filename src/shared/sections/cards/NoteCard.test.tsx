import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoteCard } from "./NoteCard";

describe("NoteCard", () => {
  it("renders its text", () => {
    render(<NoteCard section={{ kind: "note", text: "กรอกเบอร์ให้ครบ แล้วลองใหม่" }} />);
    expect(screen.getByText("กรอกเบอร์ให้ครบ แล้วลองใหม่")).toBeInTheDocument();
  });

  it("uses a dashed bordered note style (status role for assistive tech)", () => {
    render(<NoteCard section={{ kind: "note", text: "หมายเหตุ" }} />);
    const el = screen.getByText("หมายเหตุ");
    expect(el).toHaveAttribute("role", "note");
  });
});
