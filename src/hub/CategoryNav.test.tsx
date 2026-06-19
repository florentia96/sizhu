import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryNav } from "./CategoryNav";
import type { GroupId } from "../app/feature";

const counts: Record<GroupId, number> = { numbers: 3, names: 2, astro: 5, chinese: 4, daily: 8 };

describe("CategoryNav", () => {
  it("renders an 'all' chip with the total and a chip per non-empty group", () => {
    render(<CategoryNav active="all" onPick={() => {}} counts={counts} />);
    expect(screen.getByRole("button", { name: /ทั้งหมด/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ตัวเลขมงคล/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ศาสตร์จีน/ })).toBeInTheDocument();
  });

  it("hides chips for groups with zero features", () => {
    render(<CategoryNav active="all" onPick={() => {}} counts={{ ...counts, names: 0 }} />);
    expect(screen.queryByRole("button", { name: /ชื่อมงคล/ })).toBeNull();
  });

  it("calls onPick with the group id when a chip is clicked", () => {
    const onPick = vi.fn();
    render(<CategoryNav active="all" onPick={onPick} counts={counts} />);
    fireEvent.click(screen.getByRole("button", { name: /ศาสตร์จีน/ }));
    expect(onPick).toHaveBeenCalledWith("chinese");
  });

  it("marks the active chip with aria-pressed", () => {
    render(<CategoryNav active="astro" onPick={() => {}} counts={counts} />);
    expect(screen.getByRole("button", { name: /โหราศาสตร์/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /ทั้งหมด/ })).toHaveAttribute("aria-pressed", "false");
  });
});
