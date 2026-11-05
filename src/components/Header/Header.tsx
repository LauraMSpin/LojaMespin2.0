import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { STORE_CONFIG } from "../../data/settings";
import { CUSTOM_PAGE } from "../../data/customPage";
import { useCart } from "../../hooks/useCart";
import { asset } from "../../utils/format";
import { scrollToSection } from "../../utils/scroll";
import SearchBar from "../SearchBar/SearchBar";
import "./Header.css";

export default function Header() {
  const { count, openCart, addedPulse } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const onCatalog = location.pathname === "/catalogo";
  const [query, setQuery] = useState(onCatalog ? params.get("q") ?? "" : "");
  const [menuOpen, setMenuOpen] = useState(false);

  // Mantém o campo sincronizado com a URL do catálogo.
  useEffect(() => {
    setQuery(onCatalog ? params.get("q") ?? "" : "");
  }, [onCatalog, params]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleChange = (value: string) => {
    setQuery(value);
    if (onCatalog) {
      const next = new URLSearchParams(params);
      if (value.trim()) next.set("q", value);
      else next.delete("q");
      setParams(next, { replace: true });
    }
  };

  const handleSubmit = (value: string) => {
    if (onCatalog) return;
    navigate(value.trim() ? `/catalogo?q=${encodeURIComponent(value.trim())}` : "/catalogo");
  };

  const goToSection = (id: string) => {
    setMenuOpen(false);
    if (location.pathname === "/") scrollToSection(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `site-nav__link ${isActive ? "is-active" : ""}`;

  const links = (
    <>
      <NavLink to="/" end className={navClass}>
        Início
      </NavLink>
      <NavLink to="/catalogo" className={navClass}>
        Catálogo
      </NavLink>
      {CUSTOM_PAGE.enabled && (
        <NavLink to="/personalizados" className={navClass}>
          Personalizados
        </NavLink>
      )}
      {STORE_CONFIG.christmasPageEnabled && (
        <NavLink to="/natal" className={navClass}>
          Natal
        </NavLink>
      )}
      <button type="button" className="site-nav__link" onClick={() => goToSection("sobre")}>
        Sobre
      </button>
      <button type="button" className="site-nav__link" onClick={() => goToSection("contato")}>
        Contato
      </button>
    </>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <button
          type="button"
          className="site-header__menu-btn"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
        </button>

        <Link to="/" className="site-header__logo" aria-label="Mespín — página inicial">
          <img src={asset("assets/logo/logo-mespin.png")} alt="Mespín — Chamas com Alma" />
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Principal">
          {links}
        </nav>

        <SearchBar
          className="site-header__search"
          value={query}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <button type="button" className="cart-btn" onClick={openCart} aria-label={`Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`}>
          <span key={addedPulse} className={`cart-btn__icon ${addedPulse > 0 ? "is-pulsing" : ""}`}>
            <ShoppingCart size={26} aria-hidden="true" />
            {count > 0 && <span className="cart-btn__badge">{count}</span>}
          </span>
          <span className="cart-btn__label">Carrinho</span>
        </button>
      </div>

      <div className="site-header__mobile-search container">
        <SearchBar value={query} onChange={handleChange} onSubmit={handleSubmit} />
      </div>

      <nav
        id="mobile-menu"
        className={`site-nav site-nav--mobile ${menuOpen ? "is-open" : ""}`}
        aria-label="Menu principal"
      >
        {links}
      </nav>
    </header>
  );
}
