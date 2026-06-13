import { useRef, useState } from "react";
import "./tokens/tokens.css";
import "./styles/app.css";
import { compute } from "./engine/bazi";
import { buildReading, type Reading } from "./lib/reading";
import { validateForm, type RawForm } from "./lib/validate";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { FormScreen } from "./screens/FormScreen";
import { CastingScreen } from "./screens/CastingScreen";
import { ResultScreen } from "./screens/ResultScreen";

type Mode = "paper" | "casting" | "result";

const pad = (n: number): string => String(n).padStart(2, "0");

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>("paper");
  const [reading, setReading] = useState<Reading | null>(null);
  const [recap, setRecap] = useState("");
  const [error, setError] = useState("");
  const castT = useRef<number | undefined>(undefined);

  const handleSubmit = (f: RawForm): void => {
    const v = validateForm(f);
    if (!v.ok) {
      setError(v.error);
      return;
    }
    let R: Reading;
    try {
      R = buildReading(compute(v.input));
    } catch (e) {
      setError("คำนวณไม่สำเร็จ: " + (e instanceof Error ? e.message : String(e)));
      return;
    }
    setError("");
    setReading(R);
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
      {mode === "paper" && <FormScreen onSubmit={handleSubmit} error={error} />}
      {mode === "casting" && <CastingScreen onSkip={toResult} />}
      {mode === "result" && reading && (
        <ResultScreen reading={reading} recap={recap} onBack={back} />
      )}
    </div>
  );
}
