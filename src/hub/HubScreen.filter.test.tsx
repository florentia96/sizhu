import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HubScreen } from "./HubScreen";
import type { FeatureDef } from "../app/feature";

function stub(id: string, name: string, group: FeatureDef["group"]): FeatureDef {
  return {
    meta: { id, name, cn: "字", desc: `desc-${id}`, long: `long-${id}` },
    group,
    fields: [],
    engine: { build: () => [{ kind: "note", text: "stub" }] },
  };
}

const STUB: Record<string, FeatureDef> = {
  phone: stub("phone", "เบอร์มงคล", "numbers"),
  bazi: stub("bazi", "ปาจื้อ", "chinese"),
};

describe("HubScreen category filter", () => {
  it("shows all groups by default, then narrows to the picked group", () => {
    render(<HubScreen query="" onOpen={() => {}} features={STUB} />);
    expect(screen.getByRole("heading", { name: "ตัวเลขมงคล" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ศาสตร์จีน" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ศาสตร์จีน/ }));

    expect(screen.queryByRole("heading", { name: "ตัวเลขมงคล" })).toBeNull();
    expect(screen.getByRole("heading", { name: "ศาสตร์จีน" })).toBeInTheDocument();
  });
});
