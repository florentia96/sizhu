import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  const base = {
    query: "",
    onQueryChange: () => {},
    onLogo: () => {},
    onDesign: () => {},
  };

  it("renders the 卜 logo and the brand", () => {
    render(<Header {...base} />);
    expect(screen.getByText("卜")).toBeInTheDocument();
    expect(screen.getByText("มูดี")).toBeInTheDocument();
  });

  it("fires onLogo when the logo is clicked", () => {
    const onLogo = vi.fn();
    render(<Header {...base} onLogo={onLogo} />);
    fireEvent.click(screen.getByText("卜"));
    expect(onLogo).toHaveBeenCalledTimes(1);
  });

  it("controls the search input and reports changes", () => {
    const onQueryChange = vi.fn();
    render(<Header {...base} query="เบอร์" onQueryChange={onQueryChange} />);
    const input = screen.getByPlaceholderText(/ค้นหาศาสตร์/) as HTMLInputElement;
    expect(input.value).toBe("เบอร์");
    fireEvent.change(input, { target: { value: "ฝัน" } });
    expect(onQueryChange).toHaveBeenCalledWith("ฝัน");
  });

  it("fires onDesign from the ดีไซน์ button", () => {
    const onDesign = vi.fn();
    render(<Header {...base} onDesign={onDesign} />);
    fireEvent.click(screen.getByRole("button", { name: "ดีไซน์" }));
    expect(onDesign).toHaveBeenCalledTimes(1);
  });
});
