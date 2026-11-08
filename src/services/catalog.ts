import type { Product } from "../types";
import { normalizeText } from "../utils/format";
import { hasVariants, startingPrice } from "./cart";

/** Produtos com aromas, personalização ou composição (kit) exigem escolha antes de ir ao carrinho. */
export function requiresSelection(product: Product): boolean {
  return (
    product.aromas.length > 0 ||
    (product.customization?.fields.length ?? 0) > 0 ||
    (product.components?.length ?? 0) > 0 ||
    hasVariants(product)
  );
}

/** Todos os aromas de um produto, inclusive os dos componentes de kits. */
export function productAromas(product: Product): string[] {
  const set = new Set(product.aromas);
  for (const component of product.components ?? []) {
    for (const aroma of [component.aroma, ...(component.aromas ?? [])]) {
      if (aroma.mode === "choice") aroma.options.forEach((o) => set.add(o));
      else if (aroma.mode === "fixed") set.add(aroma.value);
    }
  }
  return [...set];
}

export type SortOption = "relevance" | "price-asc" | "price-desc" | "name";

export interface CatalogFilters {
  query: string;
  /** Id de categoria, "natal" (produtos natalinos) ou vazio para todas. */
  category: string;
  onlyChristmas: boolean;
  onlyFeatured: boolean;
  onlyAvailable: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortOption;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  query: "",
  category: "",
  onlyChristmas: false,
  onlyFeatured: false,
  onlyAvailable: false,
  minPrice: null,
  maxPrice: null,
  sort: "relevance"
};

/** Pontuação de relevância da busca: nome > categoria > aroma > descrição. */
function searchScore(product: Product, categoryName: string, terms: string[]): number {
  const name = normalizeText(product.name);
  const category = normalizeText(categoryName);
  const aromas = normalizeText(productAromas(product).join(" "));
  const description = normalizeText(product.description);
  let score = 0;
  for (const term of terms) {
    let termScore = 0;
    if (name.includes(term)) termScore += 8;
    if (category.includes(term)) termScore += 4;
    if (aromas.includes(term)) termScore += 3;
    if (description.includes(term)) termScore += 1;
    if (termScore === 0) return 0;
    score += termScore;
  }
  return score;
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
  categoryNameOf: (id: string) => string
): Product[] {
  const terms = normalizeText(filters.query).split(/\s+/).filter(Boolean);
  const scores = new Map<string, number>();

  let result = products.filter((p) => {
    if (filters.category === "natal") {
      if (!p.isChristmas) return false;
    } else if (filters.category && p.category !== filters.category) {
      return false;
    }
    if (filters.onlyChristmas && !p.isChristmas) return false;
    if (filters.onlyFeatured && !p.featured) return false;
    if (filters.onlyAvailable && !p.available) return false;
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      const prices = hasVariants(p) ? (p.variants ?? []).map((v) => v.price) : p.price === null ? [] : [p.price];
      const inRange = prices.some(
        (price) => (filters.minPrice === null || price >= filters.minPrice) && (filters.maxPrice === null || price <= filters.maxPrice)
      );
      if (!inRange) return false;
    }
    if (terms.length) {
      const score = searchScore(p, categoryNameOf(p.category), terms);
      if (score === 0) return false;
      scores.set(p.id, score);
    }
    return true;
  });

  const byOrder = (a: Product, b: Product) => a.sortOrder - b.sortOrder;
  const priceAsc = (a: Product, b: Product) =>
    (startingPrice(a) ?? Number.POSITIVE_INFINITY) - (startingPrice(b) ?? Number.POSITIVE_INFINITY);
  const priceDesc = (a: Product, b: Product) => {
    const pa = startingPrice(a);
    const pb = startingPrice(b);
    if (pa === null && pb === null) return 0;
    if (pa === null) return 1;
    if (pb === null) return -1;
    return pb - pa;
  };

  result = [...result];
  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => priceAsc(a, b) || byOrder(a, b));
      break;
    case "price-desc":
      result.sort((a, b) => priceDesc(a, b) || byOrder(a, b));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      break;
    default:
      result.sort(
        (a, b) =>
          (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) ||
          Number(b.featured) - Number(a.featured) ||
          byOrder(a, b)
      );
  }
  return result;
}
