import { Check } from "lucide-react";
import { useUI } from "../../context/UIContext";
import "./Toast.css";

export default function Toast() {
  const { toast } = useUI();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast}>
          <Check size={18} aria-hidden="true" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
