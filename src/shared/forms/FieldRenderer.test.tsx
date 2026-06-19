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
    expect(el.style.colorScheme).toBe("dark");
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
});
