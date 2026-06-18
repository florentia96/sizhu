import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { HubScreen } from "./HubScreen";
import type { FeatureDef } from "../app/feature";

function stubFeature(id: string, name: string, group: FeatureDef["group"]): FeatureDef {
  return {
    meta: { id, name, cn: "字", desc: `desc-${id}`, long: `long-${id}` },
    group,
    fields: [],
    engine: { build: () => [{ kind: "note", text: "stub" }] },
    fullRoute: id === "bazi",
  };
}

const STUB: Record<string, FeatureDef> = {
  phone: stubFeature("phone", "เบอร์มงคล", "numbers"),
  nameanalyze: stubFeature("nameanalyze", "วิเคราะห์ชื่อ", "names"),
  natal: stubFeature("natal", "ดวงกำเนิด", "astro"),
  bazi: stubFeature("bazi", "ปาจื้อ", "chinese"),
  dream: stubFeature("dream", "ทำนายฝัน", "daily"),
};

describe("HubScreen", () => {
  it("renders all 5 group titles from the registry", () => {
    render(<HubScreen query="" onOpen={() => {}} features={STUB} />);
    for (const title of [
      "ตัวเลขมงคล",
      "ชื่อมงคล",
      "โหราศาสตร์",
      "ศาสตร์จีน",
      "ดวงประจำวัน & ความเชื่อไทย",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("renders a card per feature and routes its id on click", () => {
    const onOpen = vi.fn();
    render(<HubScreen query="" onOpen={onOpen} features={STUB} />);
    const section = screen.getByRole("heading", { name: "ตัวเลขมงคล" }).closest("section")!;
    fireEvent.click(within(section).getByRole("button", { name: /เบอร์มงคล/ }));
    expect(onOpen).toHaveBeenCalledWith("phone");
  });

  it("shows search results and hides group sections when querying", () => {
    render(<HubScreen query="ฝัน" onOpen={() => {}} features={STUB} />);
    expect(screen.getByText(/ผลการค้นหา/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ตัวเลขมงคล" })).not.toBeInTheDocument();
    const results = screen.getByTestId("hub-search-results");
    expect(within(results).getByText("ทำนายฝัน")).toBeInTheDocument();
    expect(within(results).queryByText("เบอร์มงคล")).not.toBeInTheDocument();
  });

  it("filters case-insensitively across name and desc", () => {
    render(<HubScreen query="DESC-NATAL" onOpen={() => {}} features={STUB} />);
    const results = screen.getByTestId("hub-search-results");
    expect(within(results).getByText("ดวงกำเนิด")).toBeInTheDocument();
  });

  it("defaults to the real FEATURES registry when no features prop is given", () => {
    render(<HubScreen query="" onOpen={() => {}} />);
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
  });
});
