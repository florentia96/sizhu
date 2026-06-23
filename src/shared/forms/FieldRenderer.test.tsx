import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FieldRenderer } from "./FieldRenderer";
import type { Field } from "../../app/feature";

const noopRefFor = () => () => {};

describe("FieldRenderer", () => {
  it("date input calls showPicker() on click", () => {
    const showPicker = vi.fn();
    (HTMLInputElement.prototype as unknown as { showPicker: () => void }).showPicker =
      showPicker;
    const field: Field = { label: "วันเกิด", type: "date" };
    const { getByLabelText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    const el = getByLabelText("วันเกิด") as HTMLInputElement;
    expect(el.type).toBe("date");
    fireEvent.click(el);
    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it("time input is type=time and click-safe when showPicker missing", () => {
    delete (HTMLInputElement.prototype as unknown as { showPicker?: () => void })
      .showPicker;
    const field: Field = { label: "เวลาเกิด", type: "time" };
    const { getByLabelText } = render(
      <FieldRenderer field={field} index={1} refFor={noopRefFor} />,
    );
    const el = getByLabelText("เวลาเกิด") as HTMLInputElement;
    expect(el.type).toBe("time");
    expect(() => fireEvent.click(el)).not.toThrow();
  });

  it("text input applies iOS-safe inline UX styles", () => {
    const field: Field = { label: "เบอร์", type: "tel", placeholder: "08X" };
    const { getByLabelText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    const el = getByLabelText("เบอร์") as HTMLInputElement;
    expect(el.type).toBe("tel");
    expect(el.placeholder).toBe("08X");
    expect(el.style.fontSize).toBe("16px");
    expect(el.style.width).toBe("100%");
    expect(el.style.minWidth).toBe("0px");
    // must not pin color-scheme -> follow the page theme (light/dark) so the native picker matches the mode
    expect(el.style.colorScheme).not.toBe("dark");
  });

  it("select renders all options", () => {
    const field: Field = {
      label: "จังหวัด",
      type: "select",
      options: ["กรุงเทพ", "เชียงใหม่"],
    };
    const { getByLabelText, getByText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    const el = getByLabelText("จังหวัด") as HTMLSelectElement;
    expect(el.tagName).toBe("SELECT");
    expect(getByText("เชียงใหม่")).toBeInTheDocument();
  });

  it("textarea renders with placeholder", () => {
    const field: Field = {
      label: "ฝัน",
      type: "textarea",
      placeholder: "เล่าฝัน",
    };
    const { getByLabelText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    const el = getByLabelText("ฝัน") as HTMLTextAreaElement;
    expect(el.tagName).toBe("TEXTAREA");
    expect(el.placeholder).toBe("เล่าฝัน");
  });

  it("renders hint text below the control when provided", () => {
    const field: Field = {
      label: "ปีเกิด",
      type: "text",
      placeholder: "เช่น 2535",
      hint: "กรอกเป็น พ.ศ. หรือ ค.ศ. ก็ได้",
    };
    const { getByText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    expect(getByText("กรอกเป็น พ.ศ. หรือ ค.ศ. ก็ได้")).toBeInTheDocument();
  });

  it("applies inputMode and maxLength to inputs", () => {
    const field: Field = {
      label: "เบอร์โทร",
      type: "tel",
      inputMode: "numeric",
      maxLength: 10,
    };
    const { getByLabelText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    const el = getByLabelText("เบอร์โทร") as HTMLInputElement;
    expect(el.inputMode).toBe("numeric");
    expect(el.maxLength).toBe(10);
  });

  it("hint renders for select (dropdown explanation)", () => {
    const field: Field = {
      label: "วันเกิด",
      type: "select",
      options: ["พุธ (กลางวัน)", "พุธ (กลางคืน)"],
      hint: "เกิดหลัง 18:00 นับเป็นพุธกลางคืน",
    };
    const { getByText } = render(
      <FieldRenderer field={field} index={0} refFor={noopRefFor} />,
    );
    expect(getByText("เกิดหลัง 18:00 นับเป็นพุธกลางคืน")).toBeInTheDocument();
  });
});
