import { Instagram, MessageCircle } from "lucide-react";
import { STORE_CONFIG } from "../../data/settings";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import { Icon } from "../Icons/Icon";
import "./TopBar.css";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__inner container">
        <ul className="topbar__messages">
          {STORE_CONFIG.topBarMessages.map((m) => (
            <li key={m.text} className="topbar__item">
              <Icon name={m.icon} size={18} />
              <span>{m.text}</span>
            </li>
          ))}
        </ul>
        <div className="topbar__social">
          <a href={STORE_CONFIG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Mespín">
            <Instagram size={18} aria-hidden="true" />
          </a>
          <a href={storeWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da Mespín">
            <MessageCircle size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
