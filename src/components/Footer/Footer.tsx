import { Instagram, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { STORE_CONFIG } from "../../data/settings";
import { CUSTOM_PAGE } from "../../data/customPage";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import { asset } from "../../utils/format";
import WhatsAppIcon from "../Icons/WhatsAppIcon";
import Botanical from "./Botanical";
import "./Footer.css";

const { footer } = STORE_CONFIG;

export default function Footer() {
  return (
    <footer id="rodape" className="footer">
      <Botanical className="footer__leaf footer__leaf--left" />
      <Botanical className="footer__leaf footer__leaf--right" mirror />

      <div className="footer__main container">
        <div className="footer__col footer__brand">
          <div className="footer__logo">
            <img src={asset("assets/logo/logo-mespin.png")} alt="Mespín — Chamas com Alma" />
          </div>
          <p className="footer__slogan">{STORE_CONFIG.slogan}</p>
          <p className="footer__description">{footer.description}</p>
        </div>

        <nav className="footer__col footer__nav" aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="footer__title">
            Explore
          </h2>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/catalogo">Catálogo</Link>
            </li>
            {CUSTOM_PAGE.enabled && (
              <li>
                <Link to="/personalizados">Personalizados</Link>
              </li>
            )}
            {STORE_CONFIG.christmasPageEnabled && (
              <li>
                <Link to="/natal">Natal</Link>
              </li>
            )}
            <li>
              <Link to="/" state={{ scrollTo: "sobre" }}>
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/" state={{ scrollTo: "duvidas" }}>
                Dúvidas
              </Link>
            </li>
            <li>
              <Link to="/" state={{ scrollTo: "contato" }}>
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <div className="footer__col footer__contact">
          <h2 className="footer__title">Fale com a Mespín</h2>
          <ul className="footer__channels">
            <li>
              <a
                href={storeWhatsAppUrl(footer.contactMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="footer__icon" />
                <span>WhatsApp {STORE_CONFIG.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={STORE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="footer__icon" aria-hidden="true" />
                <span>{STORE_CONFIG.instagramHandle}</span>
              </a>
            </li>
          </ul>
          <p className="footer__order-info">{footer.orderInfo}</p>
        </div>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copyright">
          © {new Date().getFullYear()} {STORE_CONFIG.name} — {STORE_CONFIG.slogan}. Todos os direitos reservados.
        </p>
        <div className="footer__cta-area">
          <p className="footer__crafted">
            <Leaf size={22} strokeWidth={1.4} aria-hidden="true" />
            <span>{footer.craftedMessage}</span>
          </p>
          <a
            className="footer__button"
            href={storeWhatsAppUrl(footer.buttonMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="footer__button-icon" />
            Fale no WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
