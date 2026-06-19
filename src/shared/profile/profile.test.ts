import { describe, it, expect, beforeEach } from "vitest";
import type { Field } from "../../app/feature";
import {
  loadProfile,
  saveProfile,
  patchProfile,
  clearProfile,
  hasProfile,
  slotForField,
} from "./profile";

describe("profile store", () => {
  beforeEach(() => clearProfile());

  it("loads empty profile by default", () => {
    expect(loadProfile()).toEqual({});
    expect(hasProfile()).toBe(false);
  });

  it("saves and loads round-trip", () => {
    saveProfile({ birthDate: "1996-05-20" });
    expect(loadProfile()).toEqual({ birthDate: "1996-05-20" });
    expect(hasProfile()).toBe(true);
  });

  it("patch merges only non-empty values", () => {
    patchProfile({ birthDate: "1996-05-20" });
    patchProfile({ birthTime: "", city: "กรุงเทพ" });
    expect(loadProfile()).toEqual({ birthDate: "1996-05-20", city: "กรุงเทพ" });
  });

  it("clear removes the profile", () => {
    saveProfile({ birthDate: "2000-01-01" });
    clearProfile();
    expect(loadProfile()).toEqual({});
  });

  it("recovers from corrupt JSON", () => {
    localStorage.setItem("moodee.profile.v1", "{not json");
    expect(loadProfile()).toEqual({});
  });
});

describe("slotForField matcher", () => {
  const f = (x: Field): Field => x;

  it("maps date 'วันเกิด' to birthDate", () => {
    expect(slotForField(f({ label: "วันเกิด", type: "date" }))).toBe("birthDate");
  });

  it("maps city to city", () => {
    expect(slotForField(f({ label: "เมืองเกิด", type: "city" }))).toBe("city");
  });

  it("maps time 'เวลาเกิด' to birthTime", () => {
    expect(slotForField(f({ label: "เวลาเกิด", type: "time" }))).toBe("birthTime");
  });

  it("does NOT map the day-of-week select (luckycolor's วันเกิด)", () => {
    expect(
      slotForField(f({ label: "วันเกิด", type: "select", options: ["อาทิตย์", "จันทร์"] })),
    ).toBeNull();
  });

  it("does NOT map an unrelated date field", () => {
    expect(slotForField(f({ label: "เดือนที่ต้องการ", type: "month" }))).toBeNull();
  });
});
