import type { CSSProperties, MouseEvent } from "react";
import type { Field } from "../../app/feature";

type FieldNode =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | null;

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: ".83rem",
  fontWeight: 500,
  color: "var(--text-muted, #b9b2a0)",
  marginBottom: "7px",
};

const hintStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: ".73rem",
  lineHeight: 1.5,
  color: "var(--text-faint, #8a8474)",
};

const optionalStyle: CSSProperties = {
  color: "var(--text-faint, #6f6a5c)",
  fontWeight: 400,
};

const controlStyle: CSSProperties = {
  fontSize: "16px",
  width: "100%",
  minWidth: "0px",
  minHeight: "var(--tap-min, 46px)",
  border: "1.5px solid var(--border-gold)",
  background: "var(--surface-inset)",
  borderRadius: "var(--radius-input)",
  padding: "11px 12px",
  color: "var(--text)",
  outline: "none",
};

function openPicker(e: MouseEvent<HTMLInputElement>): void {
  const el = e.currentTarget as HTMLInputElement & {
    showPicker?: () => void;
  };
  if (typeof el.showPicker === "function") el.showPicker();
}

export function FieldRenderer({
  field,
  index,
  refFor,
  defaultValue,
}: {
  field: Field;
  index: number;
  refFor: (i: number) => (node: FieldNode) => void;
  defaultValue?: string;
}) {
  const id = `mf-${index}`;
  const ref = refFor(index);

  let control;
  if (field.type === "select") {
    const selDefault =
      defaultValue && field.options.includes(defaultValue) ? defaultValue : field.options[0];
    control = (
      <select
        id={id}
        ref={ref}
        style={{ ...controlStyle, appearance: "none" }}
        defaultValue={selDefault}
      >
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "textarea") {
    control = (
      <textarea
        id={id}
        ref={ref}
        rows={3}
        placeholder={field.placeholder}
        defaultValue={defaultValue}
        maxLength={field.maxLength}
        style={{ ...controlStyle, resize: "vertical" }}
      />
    );
  } else if (field.type === "city") {
    control = (
      <input
        id={id}
        ref={ref}
        type="text"
        placeholder="พิมพ์ชื่อเมืองเกิด"
        defaultValue={defaultValue}
        style={controlStyle}
      />
    );
  } else {
    const isPicker = field.type === "date" || field.type === "time";
    control = (
      <input
        id={id}
        ref={ref}
        type={field.type}
        placeholder={field.placeholder}
        defaultValue={defaultValue}
        inputMode={field.inputMode}
        maxLength={field.maxLength}
        onClick={isPicker ? openPicker : undefined}
        style={controlStyle}
      />
    );
  }

  return (
    <div style={{ marginBottom: "15px" }}>
      <label htmlFor={id} style={labelStyle}>
        {field.label}
        {field.optional && <span style={optionalStyle}> (ไม่บังคับ)</span>}
      </label>
      {control}
      {field.hint && (
        <p id={`${id}-hint`} style={hintStyle}>
          {field.hint}
        </p>
      )}
    </div>
  );
}
