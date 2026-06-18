import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

vi.mock("../../astro/cities", () => {
  const CITY = [
    { name: "Bangkok", lat: 13.75, lon: 100.5, tz: 7 },
    { name: "Chiang Mai", lat: 18.79, lon: 98.98, tz: 7 },
  ];
  return {
    CITY,
    findCity: (name: string) =>
      CITY.find((c) => c.name.toLowerCase() === name.trim().toLowerCase()) ??
      null,
  };
});

import { CityField, parseCityValue } from "./CityField";

const noopRefFor = () => () => {};

describe("CityField", () => {
  it("renders an input wired to a datalist listing CITY names", () => {
    const { container, getByText } = render(
      <CityField index={2} refFor={noopRefFor} />,
    );
    const input = container.querySelector("input") as HTMLInputElement;
    const listId = input.getAttribute("list");
    expect(listId).toBeTruthy();
    const datalist = container.querySelector(`datalist#${listId}`);
    expect(datalist).toBeTruthy();
    expect(getByText("Bangkok")).toBeInTheDocument();
    expect(getByText("Chiang Mai")).toBeInTheDocument();
  });

  it("on blur a matched city normalizes input value to Name|lat|lon|tz", () => {
    const { container } = render(<CityField index={2} refFor={noopRefFor} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Chiang Mai" } });
    fireEvent.blur(input);
    expect(input.value).toBe("Chiang Mai|18.79|98.98|7");
  });

  it("on blur an unmatched city leaves free text untouched", () => {
    const { container } = render(<CityField index={2} refFor={noopRefFor} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "13.7,100.5" } });
    fireEvent.blur(input);
    expect(input.value).toBe("13.7,100.5");
  });

  it("parseCityValue handles both pipe form and raw lat,lon fallback", () => {
    expect(parseCityValue("Bangkok|13.75|100.5|7")).toEqual({
      name: "Bangkok",
      lat: 13.75,
      lon: 100.5,
      tz: 7,
    });
    expect(parseCityValue("13.7,100.5")).toEqual({
      name: "13.7,100.5",
      lat: 13.7,
      lon: 100.5,
      tz: 7,
    });
    expect(parseCityValue("garbage")).toBeNull();
  });
});
