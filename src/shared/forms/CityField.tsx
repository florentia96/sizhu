import { useRef, useCallback, type CSSProperties } from "react";
import { CITY, findCity } from "../../astro/cities";

const controlStyle: CSSProperties = {
  fontSize: "16px",
  width: "100%",
  minWidth: "0px",
  minHeight: "var(--tap-min, 44px)",
  colorScheme: "dark",
  border: "1px solid var(--border-gold, rgba(216,166,74,.22))",
  background: "var(--surface-inset, rgba(255,255,255,.04))",
  borderRadius: "var(--radius-input, 4px)",
  padding: "11px 12px",
  color: "var(--text, #e7dcc2)",
  outline: "none",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: ".83rem",
  fontWeight: 500,
  color: "var(--text-muted, #b9b2a0)",
  marginBottom: "7px",
};

export function parseCityValue(
  v: string,
): { name: string; lat: number; lon: number; tz: number } | null {
  const raw = v.trim();
  if (!raw) return null;
  if (raw.includes("|")) {
    const [name, lat, lon, tz] = raw.split("|");
    const la = Number(lat);
    const lo = Number(lon);
    const t = Number(tz);
    if (Number.isNaN(la) || Number.isNaN(lo)) return null;
    return { name, lat: la, lon: lo, tz: Number.isNaN(t) ? 7 : t };
  }
  const m = raw.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (m) {
    return { name: raw, lat: Number(m[1]), lon: Number(m[2]), tz: 7 };
  }
  const hit = findCity(raw);
  if (hit) return hit;
  return null;
}

export function CityField({
  index,
  refFor,
  defaultValue,
}: {
  index: number;
  refFor: (i: number) => (node: HTMLInputElement | null) => void;
  defaultValue?: string;
}) {
  const id = `mf-${index}`;
  const listId = `mf-city-${index}`;
  const local = useRef<HTMLInputElement | null>(null);
  const outerRef = refFor(index);

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      local.current = node;
      outerRef(node);
    },
    [outerRef],
  );

  const normalize = useCallback(() => {
    const el = local.current;
    if (!el) return;
    const hit = findCity(el.value);
    if (hit) el.value = `${hit.name}|${hit.lat}|${hit.lon}|${hit.tz}`;
  }, []);

  return (
    <div style={{ marginBottom: "15px" }}>
      <label htmlFor={id} style={labelStyle}>
        เมืองเกิด
      </label>
      <input
        id={id}
        ref={setRef}
        type="text"
        list={listId}
        placeholder="พิมพ์ชื่อเมือง หรือ lat,lon"
        defaultValue={defaultValue}
        onBlur={normalize}
        style={controlStyle}
      />
      <datalist id={listId}>
        {CITY.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </datalist>
    </div>
  );
}
