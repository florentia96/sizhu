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
      placeholder: "0812345678",
      inputMode: "numeric",
      maxLength: 10,
      hint: "เบอร์มือถือไทย 10 หลัก",
    });
  });

  it("enforces the Thai-mobile input contract (10 digits, numeric)", () => {
    const f = fields[0];
    if (f.type !== "tel") throw new Error("phone field must be type tel");
    // Thai mobile numbers are exactly 10 digits.
    expect(f.maxLength).toBe(10);
    expect(f.inputMode).toBe("numeric");
    // placeholder is a bare 10-digit sample (no "เช่น" prefix) per spec.
    expect(f.placeholder).toBe("0812345678");
    expect(f.placeholder).toMatch(/^\d{10}$/);
    expect(f.hint).toBe("เบอร์มือถือไทย 10 หลัก");
  });

  it("keeps user-facing copy polite-neutral (no ครับ/ค่ะ/slang particles)", () => {
    const copy = [meta.name, meta.desc, meta.long, fields[0].label, fields[0].hint].join(" ");
    // ครับ / ค่ะ / นะคะ / จ้า — but NOT the legit word คะแนน (score), which starts with "คะ".
    expect(copy).not.toMatch(/ครับ|ค่ะ|นะคะ|จ้า|จ๊ะ/);
  });
});
