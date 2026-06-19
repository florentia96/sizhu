import { useEffect, useRef, useState } from "react";
import "../tokens/tokens.css";
import "../styles/app.css";
import { compute } from "../engine/bazi";
import { ageAt, annualForecast, buildReading, type AnnualItem, type Reading } from "../lib/reading";
import { validateForm, type RawForm } from "../lib/validate";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { FormScreen } from "./FormScreen";
import { CastingScreen } from "./CastingScreen";
import { ResultScreen } from "./ResultScreen";
import type { BaziPrefill } from "./baziParams";

type Mode = "paper" | "casting" | "result";

const pad = (n: number): string => String(n).padStart(2, "0");

export function BaziApp({ prefill, onHome }: { prefill?: BaziPrefill; onHome?: () => void } = {}) {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>("paper");
  const [reading, setReading] = useState<Reading | null>(null);
  const [annual, setAnnual] = useState<AnnualItem[]>([]);
  const [recap, setRecap] = useState("");
  const [error, setError] = useState("");
  const castT = useRef<number | undefined>(undefined);
  const autocast = useRef(false);

  const handleSubmit = (f: RawForm): void => {
    const v = validateForm(f);
    if (!v.ok) {
      setError(v.error);
      return;
    }
    let R: Reading;
    let ann: AnnualItem[];
    try {
      const bz = compute(v.input);
      R = buildReading(bz);
      const now = new Date();
      const startAge = ageAt(
        v.input.year, v.input.month, v.input.day,
        now.getFullYear(), now.getMonth() + 1, now.getDate(),
      );
      ann = annualForecast(bz, now.getFullYear(), 10, startAge);
    } catch (e) {
      setError("คำนวณไม่สำเร็จ: " + (e instanceof Error ? e.message : String(e)));
      return;
    }
    setError("");
    setReading(R);
    setAnnual(ann);
    const sexTh = v.input.sex === "M" ? "ชาย" : "หญิง";
    setRecap(`${pad(v.input.day)}/${pad(v.input.month)}/${v.input.year} · ${f.time || "12:00"} น. · ${sexTh}`);
    if (reduced) {
      setMode("result");
      window.scrollTo(0, 0);
      return;
    }
    setMode("casting");
    window.clearTimeout(castT.current);
    castT.current = window.setTimeout(() => {
      setMode("result");
      window.scrollTo(0, 0);
    }, 1650);
  };

  // prefill จาก ?bd=&bt= → ยิง submit ครั้งเดียวบน mount (sex default 'M', time default '12:00')
  // mirror _prefillFromURL: bd มี ⇒ ข้ามฟอร์มไป casting/result
  useEffect(() => {
    if (!prefill?.autocast || !prefill.date || autocast.current) return;
    autocast.current = true;
    handleSubmit({
      date: prefill.date,
      time: prefill.time ?? "12:00",
      sex: "M",
      tz: "7",
      lon: "100.5",
      useSolar: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toResult = (): void => {
    window.clearTimeout(castT.current);
    setMode("result");
    window.scrollTo(0, 0);
  };
  const back = (): void => {
    window.clearTimeout(castT.current);
    setMode("paper");
    setError("");
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      {mode === "paper" && (
        <FormScreen
          onSubmit={handleSubmit}
          error={error}
          initialDate={prefill?.date}
          initialTime={prefill?.time}
          onHome={onHome}
        />
      )}
      {mode === "casting" && <CastingScreen onSkip={toResult} />}
      {mode === "result" && reading && (
        <ResultScreen reading={reading} annual={annual} recap={recap} onBack={back} onHome={onHome} />
      )}
    </div>
  );
}

export default BaziApp;
