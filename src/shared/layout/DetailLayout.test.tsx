import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import type { FeatureDef } from "../../app/feature";

vi.mock("../../app/registry", () => {
  const phoneDef: FeatureDef = {
    meta: {
      id: "phone",
      name: "วิเคราะห์เบอร์",
      cn: "號",
      desc: "เบอร์ → เกรด",
      long: "วิเคราะห์เบอร์โทร",
    },
    group: "numbers",
    fields: [{ label: "เบอร์", type: "tel", placeholder: "08X" }],
    engine: {
      build: (vals: string[]) => [{ kind: "note", text: `got:${vals[0]}` }],
    },
  };
  const natalDef: FeatureDef = {
    ...phoneDef,
    meta: { ...phoneDef.meta, id: "natal" },
    group: "astro",
    fields: [{ label: "เมืองเกิด", type: "city" }],
  };
  return { FEATURES: { phone: phoneDef, natal: natalDef } };
});

vi.mock("../../hub/groups", () => ({
  accentOf: (group: string) => (group === "astro" ? "#7da6d8" : "#6cc18a"),
}));

vi.mock("../sections/SectionRenderer", () => ({
  SectionRenderer: ({
    sections,
    accent,
  }: {
    sections: { kind: string; text?: string }[];
    accent: string;
  }) => (
    <div data-testid="section-renderer" data-accent={accent}>
      {sections.map((s, i) => (
        <div key={i} data-testid="section">
          {s.text ?? s.kind}
        </div>
      ))}
    </div>
  ),
}));

import { DetailLayout } from "./DetailLayout";

describe("DetailLayout", () => {
  it("shows empty state before submit (no SectionRenderer)", () => {
    const { queryByTestId, getByText } = render(
      <DetailLayout id="phone" onHome={() => {}} />,
    );
    expect(queryByTestId("section-renderer")).toBeNull();
    expect(getByText(/กรอกข้อมูลทางซ้าย/)).toBeInTheDocument();
  });

  it("after submit, renders sections from engine.build(readInputs) with the group accent", () => {
    const { getByText, getByLabelText, getByTestId } = render(
      <DetailLayout id="phone" onHome={() => {}} />,
    );
    fireEvent.change(getByLabelText("เบอร์"), {
      target: { value: "0812345678" },
    });
    fireEvent.click(getByText("เปิดดูผลทำนาย"));
    const renderer = getByTestId("section-renderer");
    expect(renderer.getAttribute("data-accent")).toBe("#6cc18a");
    expect(within(renderer).getByText("got:0812345678")).toBeInTheDocument();
  });

  it("renders a CityField for a type:city field", () => {
    const { container } = render(
      <DetailLayout id="natal" onHome={() => {}} />,
    );
    expect(container.querySelector("datalist")).toBeTruthy();
  });
});
