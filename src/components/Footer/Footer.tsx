import { Instagram, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { STORE_CONFIG } from "../../data/settings";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import { asset } from "../../utils/format";
import { scrollToSection } from "../../utils/scroll";
import "./Footer.css";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (id: string) => {
    if (location.pathname === "/") scrollToSection(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <img src={asset("assets/logo/logo-mespin.png")} alt="Mespín — Chamas com Alma" />
          <p>{STORE_CONFIG.slogan}</p>
        </div>

        <nav className="footer__col" aria-label="Rodapé">
          <h2>Navegação</h2>
          <Link to="/">Início</Link>
          <Link to="/catalogo">Catálogo</Link>
          {STORE_CONFIG.christmasPageEnabled && <Link to="/natal">Natal</Link>}
          <button type="button" onClick={() => goToSection("sobre")}>
            Sobre
          </button>
          <button type="button" onClick={() => goToSection("contato")}>
            Contato
          </button>
        </nav>

        <div className="footer__col">
          <h2>Atendimento</h2>
          <a href={storeWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp {STORE_CONFIG.whatsappDisplay}
          </a>
          <a href={STORE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram size={16} aria-hidden="true" /> {STORE_CONFIG.instagramHandle}
          </a>
          <p className="footer__note">
            Pedidos finalizados pelo WhatsApp. Frete, disponibilidade e pagamento são confirmados no atendimento.
          </p>
        </div>
      </div>
      <div className="footer__legal">
        © {new Date().getFullYear()} {STORE_CONFIG.name} — {STORE_CONFIG.slogan}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
