import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import "./QuantityStepper.css";

interface Props {
  value: number;
  min?: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
  size?: "md" | "sm";
  /** Incremento dos botões (padrão 1). */
  step?: number;
  /**
   * Mínimo de pedido: o valor fica em 0 (não escolhido) ou ≥ `floor`.
   * "+" a partir de 0 vai direto a `floor`; "−" em `floor` volta a 0.
   */
  floor?: number;
  /** Permite digitar a quantidade (útil para pedidos grandes). */
  editable?: boolean;
}

export default function QuantityStepper({
  value,
  min = 0,
  max,
  label,
  onChange,
  size = "md",
  step = 1,
  floor = 0,
  editable = false
}: Props) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const increase = () => {
    if (floor > 0 && value === 0) return Math.min(max, floor);
    return Math.min(max, value + step);
  };
  const decrease = () => {
    if (floor > 0 && value <= floor) return 0;
    return Math.max(min, value - step);
  };

  const commit = () => {
    const parsed = Math.floor(Number(draft));
    if (!Number.isFinite(parsed) || draft.trim() === "") {
      setDraft(String(value));
      return;
    }
    let next = Math.min(max, Math.max(min, parsed));
    if (floor > 0 && next > 0 && next < floor) next = floor;
    if (floor > 0 && parsed <= 0) next = 0;
    if (step > 1 && next > floor) next = floor + Math.round((next - floor) / step) * step;
    next = Math.min(max, next);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(decrease())}
        disabled={value <= min}
        aria-label={`Diminuir quantidade: ${label}`}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      {editable ? (
        <input
          className="stepper__input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft}
          aria-label={`Quantidade: ${label}`}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
      ) : (
        <output className="stepper__value" aria-live="polite" key={value}>
          {value}
        </output>
      )}
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(increase())}
        disabled={value >= max}
        aria-label={`Aumentar quantidade: ${label}`}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
