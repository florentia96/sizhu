import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CastingScreen } from "./CastingScreen";

// ระบบไม่ระบุเพศ — ห้ามคำลงท้ายระบุเพศ/สแลง (ผูกท้ายประโยคเพื่อไม่ชนคำปกติเช่น "คะแนน")
const PARTICLE = /(ครับ|ค่ะ|คะ|นะคะ|จ้า|จ้ะ|ฮะ|ฮ่ะ)(?=["'\s.,!?)…]|$)/;

describe("CastingScreen", () => {
  it("ใช้โทนกลาง ไม่มีคำลงท้ายระบุเพศ (ครับ/ค่ะ/คะ/นะคะ)", () => {
    const { container } = render(<CastingScreen onSkip={() => {}} />);
    const aria = container.querySelector("button")?.getAttribute("aria-label") ?? "";
    const text = `${container.textContent ?? ""} ${aria}`;
    expect(text).not.toMatch(PARTICLE);
  });
});
