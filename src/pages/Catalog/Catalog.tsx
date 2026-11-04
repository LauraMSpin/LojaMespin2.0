import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryNavigation from "../../components/CategoryNavigation/CategoryNavigation";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import SearchBar from "../../components/SearchBar/SearchBar";
import { getCategory } from "../../data/categories";
import { PRODUCTS } from "../../data/products";
import { DEFAULT_FILTERS, filterProducts, type SortOption } from "../../services/catalog";
import "./Catalog.css";

const PRICE_RANGES: Record<string, { label: string; min: number | null; max: number | null }> = {
  "": { label: "Qualquer preço", min: null, max: null },
  "ate-50": { label: "Até R$ 50", min: 0, max: 50 },
  "50-100": { label: "R$ 50 a R$ 100", min: 50, max: 100 },
  "acima-100": { label: "Acima de R$ 100", min: 100.01, max: null }
};

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevância",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  name: "Ordem alfabética"
};

export default function Catalog() {
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const category = params.get("categoria") ?? "";
  const onlyChristmas = params.get("natal") === "1";
  const onlyFeatured = params.get("destaques") === "1";
  const onlyAvailable = params.get("disponiveis") === "1";
  const priceKey = PRICE_RANGES[params.get("preco") ?? ""] ? params.get("preco") ?? "" : "";
  const sortParam = params.get("ordem") as SortOption | null;
  const sort: SortOption = sortParam && sortParam in SORT_LABELS ? sortParam : "relevance";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const products = useMemo(() => {
    const range = PRICE_RANGES[priceKey];
    return filterProducts(
      PRODUCTS,
      {
        ...DEFAULT_FILTERS,
        query,
        category,
        onlyChristmas,
        onlyFeatured,
        onlyAvailable,
        minPrice: range.min,
        maxPrice: range.max,
        sort
      },
      (id) => getCategory(id)?.name ?? ""
    );
  }, [query, category, onlyChristmas, onlyFeatured, onlyAvailable, priceKey, sort]);

  const hasFilters = Boolean(query || category || onlyChristmas || onlyFeatured || onlyAvailable || priceKey);

  const getLink = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("categoria", id);
    else next.delete("categoria");
    const qs = next.toString();
    return qs ? `/catalogo?${qs}` : "/catalogo";
  };

  return (
    <>
      <div className="catalog-hero">
        <div className="container">
          <h1 className="section-title">Catálogo</h1>
        </div>
      </div>

      <CategoryNavigation active={category} getLink={getLink} />

      <section className="catalog container" aria-label="Produtos">
        <div className="catalog__toolbar">
          <SearchBar
            value={query}
            onChange={(v) => setParam("q", v)}
            label="Buscar produtos por nome, categoria, aroma ou descrição"
            placeholder="Buscar por nome, aroma, categoria..."
          />
          <label className="select-wrap">
            <span className="sr-only">Ordenar por</span>
            <select value={sort} onChange={(e) => setParam("ordem", e.target.value === "relevance" ? "" : e.target.value)}>
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog__filters" role="group" aria-label="Filtros">
          <label className="check">
            <input type="checkbox" checked={onlyChristmas} onChange={(e) => setParam("natal", e.target.checked ? "1" : "")} />
            <span>Natal</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={onlyFeatured} onChange={(e) => setParam("destaques", e.target.checked ? "1" : "")} />
            <span>Destaques</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setParam("disponiveis", e.target.checked ? "1" : "")} />
            <span>Disponíveis</span>
          </label>
          <label className="select-wrap">
            <span className="sr-only">Faixa de preço</span>
            <select value={priceKey} onChange={(e) => setParam("preco", e.target.value)}>
              {Object.entries(PRICE_RANGES).map(([value, r]) => (
                <option key={value} value={value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {hasFilters && (
            <button type="button" className="catalog__clear" onClick={() => setParams({}, { replace: true })}>
              Limpar filtros
            </button>
          )}
        </div>

        <p className="catalog__count" role="status" aria-live="polite">
          {products.length === 1 ? "1 produto" : `${products.length} produtos`}
        </p>

        <ProductGrid
          products={products}
          emptyMessage="Não encontramos produtos com esses filtros."
          onClear={() => setParams({}, { replace: true })}
        />
      </section>
    </>
  );
}
