import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodayCard } from "./TodayCard";

describe("TodayCard", () => {
  it("shows the birthdate prompt when no profile is saved", () => {
    render(<TodayCard profile={{}} onOpen={() => {}} />);
    expect(screen.getByText(/กรอกวันเกิดที่ช่องด้านบน/)).toBeInTheDocument();
  });

  it("shows quick-launch chips when a birthdate is provided", () => {
    render(<TodayCard profile={{ birthDate: "1996-05-20" }} onOpen={() => {}} />);
    expect(screen.getByText(/วันเกิดที่บันทึกไว้/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ดวงวันเกิด/ })).toBeInTheDocument();
  });

  it("launches a feature from a quick chip when a profile exists", () => {
    const onOpen = vi.fn();
    render(<TodayCard profile={{ birthDate: "1996-05-20" }} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /ดวงวันเกิด/ }));
    expect(onOpen).toHaveBeenCalledWith("birthday");
  });

  it("always shows today's lucky colors", () => {
    render(<TodayCard profile={{}} onOpen={() => {}} />);
    expect(screen.getByText(/สีมงคลของวัน/)).toBeInTheDocument();
  });
});
