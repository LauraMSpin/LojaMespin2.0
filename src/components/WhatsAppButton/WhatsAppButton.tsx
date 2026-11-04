import { MessageCircle } from "lucide-react";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={storeWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Mespín no WhatsApp"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
}
