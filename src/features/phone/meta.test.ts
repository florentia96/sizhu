import { describe, it, expect } from "vitest";
import { meta } from "./meta";
import { fields } from "./fields";

describe("phone meta + fields", () => {
  it("declares the correct identity", () => {
    expect(meta.id).toBe("phone");
    expect(meta.cn).toBe("號");
    expect(meta.name).toBe("วิเคราะห์เบอร์โทรมงคล");
    expect(meta.desc.length).toBeGreaterThan(0);
    expect(meta.long.length).toBeGreaterThan(0);
  });

  it("has exactly one tel field for the phone number", () => {
    expect(fields).toHaveLength(1);
    expect(fields[0]).toEqual({
      label: "เบอร์โทรศัพท์",
      type: "tel",
      placeholder: "เช่น 0812345678",
      inputMode: "numeric",
      maxLength: 10,
      hint: "เบอร์มือถือ 10 หลัก",
    });
  });
});
