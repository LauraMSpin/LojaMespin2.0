import { Instagram, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CategoryNavigation from "../../components/CategoryNavigation/CategoryNavigation";
import Hero from "../../components/Hero/Hero";
import { Icon } from "../../components/Icons/Icon";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import Reveal from "../../components/Reveal";
import SearchBar from "../../components/SearchBar/SearchBar";
import { CATEGORIES, getCategory } from "../../data/categories";
import { PRODUCTS } from "../../data/products";
import { STORE_CONFIG } from "../../data/settings";
import { DEFAULT_FILTERS, filterProducts } from "../../services/catalog";
import { storeWhatsAppUrl } from "../../services/whatsapp";
import { scrollToSection } from "../../utils/scroll";
import "./Home.css";

export default function Home() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      const timer = window.setTimeout(() => scrollToSection(target), 80);
      return () => window.clearTimeout(timer);
    }
  }, [location.state]);

  const filtering = query.trim() !== "" || category !== "";
  const products = useMemo(() => {
    const result = filterProducts(PRODUCTS, { ...DEFAULT_FILTERS, query, category }, (id) => getCategory(id)?.name ?? "");
    return filtering ? result : result.slice(0, STORE_CONFIG.featuredLimit);
  }, [query, category, filtering]);

  const getLink = (id: string) =>
    id === "" ? "/catalogo" : id === "natal" ? "/natal" : `/catalogo?categoria=${id}`;

  return (
    <>
      <Hero />
      <CategoryNavigation getLink={getLink} />

      <section id="catalogo" className="home-catalog container">
        <div className="home-catalog__head">
          <h2 className="section-title">Nosso Catálogo</h2>
          <div className="home-catalog__tools">
            <SearchBar value={query} onChange={setQuery} label="Buscar produtos no catálogo" />
            <label className="select-wrap">
              <span className="sr-only">Filtrar por categoria</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Todas as Categorias</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {STORE_CONFIG.christmasPageEnabled && <option value="natal">Natal</option>}
              </select>
            </label>
          </div>
        </div>

        <ProductGrid
          products={products}
          emptyMessage="Não encontramos produtos para essa busca."
          onClear={() => {
            setQuery("");
            setCategory("");
          }}
        />

        <div className="home-catalog__more">
          <Link to="/catalogo" className="btn btn--ghost">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      <section id="sobre" className="about">
        <Reveal className="about__inner container">
          <div className="about__text">
            <h2 className="section-title">{STORE_CONFIG.about.title}</h2>
            {STORE_CONFIG.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="about__highlights">
            {STORE_CONFIG.about.highlights.map((h) => (
              <li key={h.title}>
                <span className="about__icon">
                  <Icon name={h.icon} size={26} strokeWidth={1.5} />
                </span>
                <div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section id="contato" className="contact container">
        <Reveal>
          <h2 className="section-title">Contato</h2>
          <p className="contact__intro">
            Tem dúvidas, quer um aroma específico ou uma opção para presente? Fale com a gente.
          </p>
          <div className="contact__actions">
            <a className="btn btn--whatsapp" href={storeWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp {STORE_CONFIG.whatsappDisplay}
            </a>
            <a className="btn btn--ghost" href={STORE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram size={18} aria-hidden="true" /> {STORE_CONFIG.instagramHandle}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
