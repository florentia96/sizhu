import { useRef, useCallback } from "react";

type FieldNode =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | null;

export interface FormRefs {
  refFor(i: number): (node: FieldNode) => void;
  readInputs(n: number): string[];
  reset(): void;
}

export function useFormRefs(): FormRefs {
  const refs = useRef<Record<number, FieldNode>>({});

  const refFor = useCallback(
    (i: number) => (node: FieldNode) => {
      if (node) refs.current[i] = node;
      else delete refs.current[i];
    },
    [],
  );

  const readInputs = useCallback((n: number): string[] => {
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      const el = refs.current[i];
      out.push(el ? el.value : "");
    }
    return out;
  }, []);

  const reset = useCallback((): void => {
    refs.current = {};
  }, []);

  return { refFor, readInputs, reset };
}
