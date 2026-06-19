import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodayCard } from "./TodayCard";
import { saveProfile, clearProfile } from "../shared/profile/profile";

describe("TodayCard", () => {
  beforeEach(() => clearProfile());

  it("shows the birthdate prompt when no profile is saved", () => {
    render(<TodayCard onOpen={() => {}} />);
    expect(screen.getByLabelText("วันเกิดของคุณ")).toBeInTheDocument();
    expect(screen.getByText(/บันทึกวันเกิดครั้งเดียว/)).toBeInTheDocument();
  });

  it("saves the birthdate on pick and switches to quick-launch chips", () => {
    render(<TodayCard onOpen={() => {}} />);
    fireEvent.change(screen.getByLabelText("วันเกิดของคุณ"), { target: { value: "1996-05-20" } });
    expect(screen.getByText(/วันเกิดที่บันทึกไว้/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ดวงวันเกิด/ })).toBeInTheDocument();
  });

  it("launches a feature from a quick chip when a profile exists", () => {
    saveProfile({ birthDate: "1996-05-20" });
    const onOpen = vi.fn();
    render(<TodayCard onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /ดวงวันเกิด/ }));
    expect(onOpen).toHaveBeenCalledWith("birthday");
  });

  it("always shows today's lucky colors", () => {
    render(<TodayCard onOpen={() => {}} />);
    expect(screen.getByText(/สีมงคลของวัน/)).toBeInTheDocument();
  });
});
