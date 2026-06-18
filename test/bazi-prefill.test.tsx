import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { BaziApp } from "../src/screens/BaziApp";
import { FormScreen } from "../src/screens/FormScreen";

afterEach(cleanup);

describe("FormScreen: initialDate/initialTime prefill the inputs", () => {
  it("uses provided initial values instead of the 2000-01-01 default", () => {
    render(<FormScreen onSubmit={() => {}} error="" initialDate="1996-04-03" initialTime="23:58" />);
    const date = screen.getByLabelText(/วันเกิด/) as HTMLInputElement;
    const time = screen.getByLabelText(/เวลาเกิด/) as HTMLInputElement;
    expect(date.value).toBe("1996-04-03");
    expect(time.value).toBe("23:58");
  });

  it("falls back to defaults when no initial props given", () => {
    render(<FormScreen onSubmit={() => {}} error="" />);
    const date = screen.getByLabelText(/วันเกิด/) as HTMLInputElement;
    expect(date.value).toBe("2000-01-01");
  });

  it("interaction parity: ปุ่ม 'เปิดดวงปาจื้อ' ยังส่งฟอร์มได้", () => {
    let got: { date: string } | null = null;
    render(<FormScreen onSubmit={(f) => { got = f; }} error="" initialDate="1990-12-25" />);
    fireEvent.click(screen.getByText("เปิดดวงปาจื้อ"));
    expect(got).not.toBeNull();
    expect(got!.date).toBe("1990-12-25");
  });
});

describe("BaziApp: prefill autocast skips the form on mount", () => {
  it("with valid prefill + reduced motion → renders result (skips paper)", () => {
    // reduced-motion path goes straight to result (no 1650ms timer)
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduce"),
      media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    render(<BaziApp prefill={{ date: "1996-04-03", time: "23:58", autocast: true }} />);
    // result screen brand shows 八字 + recap; form head 'กรอกวัน-เวลาเกิด' must be gone
    expect(screen.queryByText("กรอกวัน-เวลาเกิด")).toBeNull();
    expect(screen.getByText(/03\/04\/1996/)).toBeTruthy();
  });

  it("without prefill → shows the form (paper mode)", () => {
    window.matchMedia = ((q: string) => ({
      matches: false, media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    render(<BaziApp />);
    expect(screen.getByText("กรอกวัน-เวลาเกิด")).toBeTruthy();
  });
});
