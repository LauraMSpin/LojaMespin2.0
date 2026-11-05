import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import "./WhatsAppButton.css";

/** Botão flutuante; some quando o rodapé (que já tem WhatsApp) entra na tela. */
export default function WhatsAppButton() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("rodape");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      className={`wa-float ${footerVisible ? "is-hidden" : ""}`}
      href={storeWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Mespín no WhatsApp"
      tabIndex={footerVisible ? -1 : undefined}
      aria-hidden={footerVisible || undefined}
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
}
