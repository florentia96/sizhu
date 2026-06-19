import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useFormRefs } from "./useFormRefs";

function Harness({ onRead }: { onRead: (vals: string[]) => void }) {
  const { refFor, readInputs } = useFormRefs();
  return (
    <div>
      <input data-testid="i0" ref={refFor(0)} defaultValue="" />
      <select data-testid="i1" ref={refFor(1)} defaultValue="b">
        <option value="a">a</option>
        <option value="b">b</option>
      </select>
      <textarea data-testid="i2" ref={refFor(2)} defaultValue="" />
      <button onClick={() => onRead(readInputs(3))}>read</button>
    </div>
  );
}

describe("useFormRefs — uncontrolled read-on-submit", () => {
  it("reads current values by index, mapping select/textarea too", () => {
    let captured: string[] = [];
    const { getByTestId, getByText } = render(
      <Harness onRead={(v) => (captured = v)} />,
    );
    fireEvent.change(getByTestId("i0"), { target: { value: "0812345678" } });
    fireEvent.change(getByTestId("i1"), { target: { value: "a" } });
    fireEvent.change(getByTestId("i2"), { target: { value: "เล่าฝัน" } });
    fireEvent.click(getByText("read"));
    expect(captured).toEqual(["0812345678", "a", "เล่าฝัน"]);
  });

  it("returns empty string for indices with no mounted node", () => {
    let captured: string[] = [];
    function Sparse({ onRead }: { onRead: (v: string[]) => void }) {
      const { refFor, readInputs } = useFormRefs();
      return (
        <div>
          <input data-testid="only" ref={refFor(1)} defaultValue="x" />
          <button onClick={() => onRead(readInputs(3))}>read</button>
        </div>
      );
    }
    const { getByText } = render(<Sparse onRead={(v) => (captured = v)} />);
    fireEvent.click(getByText("read"));
    expect(captured).toEqual(["", "x", ""]);
  });
});
