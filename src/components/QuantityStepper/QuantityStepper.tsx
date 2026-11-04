import { Minus, Plus } from "lucide-react";
import "./QuantityStepper.css";

interface Props {
  value: number;
  min?: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
  size?: "md" | "sm";
}

export default function QuantityStepper({ value, min = 0, max, label, onChange, size = "md" }: Props) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Diminuir quantidade: ${label}`}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <output className="stepper__value" aria-live="polite" key={value}>
        {value}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Aumentar quantidade: ${label}`}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
