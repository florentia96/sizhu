import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import BaziApp from "../src/screens/BaziApp";

describe("App — end-to-end ใน jsdom", () => {
  it("ฟอร์ม → เปิดดวง → casting → หน้าผลแสดงครบ", () => {
    vi.useFakeTimers();
    try {
      render(<BaziApp />);
      expect(screen.getByText("ปาจื้อ — ดูดวงสี่เสา")).toBeInTheDocument();

      fireEvent.click(screen.getByText("เปิดดวงปาจื้อ"));
      expect(screen.getByText("กำลังเปิดดวง…")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1700);
      });
      expect(screen.getByText("ผังสี่เสา (四柱)")).toBeInTheDocument();
      expect(screen.getByText(/คุณคือ/)).toBeInTheDocument();
      expect(screen.getByText("ต้าอวิ้น (大運 · ดวงรอบ 10 ปี)")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("กรอกวันว่างแล้วกด → ขึ้น error ไม่ crash", () => {
    render(<BaziApp />);
    fireEvent.change(screen.getByLabelText("วันเกิด (สากล)"), { target: { value: "" } });
    fireEvent.click(screen.getByText("เปิดดวงปาจื้อ"));
    expect(screen.getByText("กรุณาใส่วันเกิด")).toBeInTheDocument();
  });
});
