import { describe, it, expect } from "vitest";
import { validateForm } from "../src/lib/validate";
import type { Sex } from "../src/types";

const invalidSex = "X" as unknown as Sex;

describe("validateForm — ปิดช่อง input", () => {
  it("เคสปกติผ่าน", () => {
    expect(validateForm({ date: "1996-04-03", time: "23:58", sex: "M" }).ok).toBe(true);
  });
  it("วันเกิดว่าง → ไม่ผ่าน", () => {
    expect(validateForm({ date: "", time: "12:00", sex: "M" }).ok).toBe(false);
  });
  it("31 ก.พ. (ไม่มีจริง) → ไม่ผ่าน", () => {
    expect(validateForm({ date: "2001-02-31", time: "12:00", sex: "M" }).ok).toBe(false);
  });
  it("29 ก.พ. ปีไม่อธิกสุรทิน → ไม่ผ่าน", () => {
    expect(validateForm({ date: "2001-02-29", time: "12:00", sex: "F" }).ok).toBe(false);
  });
  it("29 ก.พ. ปีอธิกสุรทิน → ผ่าน", () => {
    expect(validateForm({ date: "2000-02-29", time: "12:00", sex: "F" }).ok).toBe(true);
  });
  it("ปีนอกช่วง → ไม่ผ่าน", () => {
    expect(validateForm({ date: "1899-01-01", time: "12:00", sex: "M" }).ok).toBe(false);
  });
  it("เขตเวลาว่าง → ใช้ดีฟอลต์ ผ่าน", () => {
    expect(validateForm({ date: "2000-01-01", time: "12:00", sex: "M", tz: "" }).ok).toBe(true);
  });
  it("เขตเวลาไม่ใช่ตัวเลข (NaN) → ไม่ผ่าน", () => {
    expect(validateForm({ date: "2000-01-01", time: "12:00", sex: "M", tz: "abc" }).ok).toBe(false);
  });
  it("ลองจิจูดเกินช่วง → ไม่ผ่าน", () => {
    expect(validateForm({ date: "2000-01-01", time: "12:00", sex: "M", lon: 999 }).ok).toBe(false);
  });
  it("เพศผิด → ไม่ผ่าน", () => {
    expect(validateForm({ date: "2000-01-01", time: "12:00", sex: invalidSex }).ok).toBe(false);
  });
});
