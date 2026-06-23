import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CastingScreen } from "./CastingScreen";

// The system is gender-neutral - no gendered finals/slang (anchored to sentence end so it does not collide with normal words like "khanaen")
const PARTICLE = /(ครับ|ค่ะ|คะ|นะคะ|จ้า|จ้ะ|ฮะ|ฮ่ะ)(?=["'\s.,!?)…]|$)/;

describe("CastingScreen", () => {
  it("ใช้โทนกลาง ไม่มีคำลงท้ายระบุเพศ (ครับ/ค่ะ/คะ/นะคะ)", () => {
    const { container } = render(<CastingScreen onSkip={() => {}} />);
    const aria = container.querySelector("button")?.getAttribute("aria-label") ?? "";
    const text = `${container.textContent ?? ""} ${aria}`;
    expect(text).not.toMatch(PARTICLE);
  });
});
