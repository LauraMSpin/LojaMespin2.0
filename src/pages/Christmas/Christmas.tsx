import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { getCategory } from "../../data/categories";
import { PRODUCTS } from "../../data/products";
import { STORE_CONFIG } from "../../data/settings";
import { DEFAULT_FILTERS, filterProducts, type SortOption } from "../../services/catalog";
import { asset } from "../../utils/format";
import { scrollToSection } from "../../utils/scroll";
import "./Christmas.css";

export default function Christmas() {
  const [sort, setSort] = useState<SortOption>("relevance");

  const products = useMemo(
    () =>
      filterProducts(
        PRODUCTS,
        { ...DEFAULT_FILTERS, onlyChristmas: true, sort },
        (id) => getCategory(id)?.name ?? ""
      ),
    [sort]
  );

  if (!STORE_CONFIG.christmasPageEnabled) return <Navigate to="/" replace />;
  const { christmas } = STORE_CONFIG;

  return (
    <div className="theme-natal natal">
      <section className="natal-hero container" aria-labelledby="natal-title">
        <div className="natal-hero__stage">
          <img src={asset(christmas.image)} alt="Velas acesas, pinhas, ramos de pinheiro, presentes e luzes douradas" />
          <div className="natal-hero__content">
            <h1 id="natal-title" className="fade-in">{christmas.title}</h1>
            <span className="natal-hero__rule" aria-hidden="true" />
            <p className="fade-in">{christmas.description}</p>
            <button type="button" className="btn natal-hero__cta" onClick={() => scrollToSection("colecao-natal")}>
              {christmas.ctaLabel} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <nav className="natal-nav container" aria-label="Navegação da coleção de Natal">
        <Link to="/">← Página inicial</Link>
        <Link to="/catalogo">Ver catálogo completo</Link>
      </nav>

      <section id="colecao-natal" className="natal-grid container" aria-label="Coleção de Natal">
        <div className="natal-grid__head">
          <h2 className="section-title">Coleção de Natal</h2>
          <label className="select-wrap">
            <span className="sr-only">Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Ordem alfabética</option>
            </select>
          </label>
        </div>
        <ProductGrid products={products} emptyMessage="Em breve novidades natalinas por aqui." />
      </section>
    </div>
  );
}
