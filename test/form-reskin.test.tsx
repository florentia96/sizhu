import { describe, it, expect, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { FormScreen } from "../src/screens/FormScreen";

afterEach(cleanup);

const css = readFileSync(resolve(__dirname, "../src/styles/app.css"), "utf8");
// isolate the form block (everything before the result/dark section starts)
const formBlock = css.slice(0, css.indexOf(".result-screen") >= 0 ? css.indexOf(".result-screen") : css.length);

describe("FormScreen reskin: MooDee dark via tokens only", () => {
  it("form block no longer references the aged-paper palette vars", () => {
    for (const v of ["--paper", "--panel", "--field-bg", "--ink", "--ink-soft", "--ink-faint", "--edge", "--cinnabar"]) {
      expect(formBlock).not.toContain(`var(${v})`);
    }
  });

  it("form block uses MooDee dark tokens", () => {
    expect(formBlock).toContain("var(--bg");      // background token family
    expect(formBlock).toContain("var(--surface"); // card surface
    expect(formBlock).toContain("var(--primary"); // cinnabar CTA
    expect(formBlock).toContain("var(--text");    // ink → text
  });

  it("no hardcoded hex color in the form block (tokens only)", () => {
    // allow #fff on the CTA label only via token; flag raw 6/3-digit hex elsewhere
    const hexes = formBlock.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    expect(hexes).toEqual([]);
  });

  it("interaction parity: all controls still present & clickable after reskin", () => {
    let submitted = false;
    render(<FormScreen onSubmit={() => { submitted = true; }} error="" />);
    expect(screen.getByText("เพศ", { exact: false })).toBeTruthy();
    fireEvent.click(screen.getByText("ตั้งค่าขั้นสูง", { exact: false }));
    expect(screen.getByLabelText(/เขตเวลา/)).toBeTruthy();
    expect(screen.getByText(/ปรับเป็นเวลาสุริยคติจริง/)).toBeTruthy();
    fireEvent.click(screen.getByText("เปิดดวงปาจื้อ"));
    expect(submitted).toBe(true);
  });
});
